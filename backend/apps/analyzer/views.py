import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
import chess.pgn
import io
import httpx
from groq import Groq

# Make sure GROQ_API_KEY is in environment variables or .env

class AnalyzeGameView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        pgn_text = request.data.get('pgn', '')
        if not pgn_text:
            return Response({'error': 'No PGN provided'}, status=status.HTTP_400_BAD_REQUEST)

        # Parse PGN
        pgn_io = io.StringIO(pgn_text)
        game = chess.pgn.read_game(pgn_io)
        
        if game is None:
            return Response({'error': 'Invalid PGN format'}, status=status.HTTP_400_BAD_REQUEST)

        headers = game.headers
        moves = []
        board = game.board()
        for move in game.mainline_moves():
            moves.append(board.san(move))
            board.push(move)

        moves_str = " ".join(moves)
        
        # Prepare Prompt for Groq
        prompt = f"""You are an elite Grandmaster chess coach.
Please analyze the following chess game and provide a helpful, encouraging, but highly analytical review.
Identify the opening played, point out potential critical moments or mistakes, and give advice to the player.

Game Headers:
White: {headers.get('White', 'Unknown')}
Black: {headers.get('Black', 'Unknown')}
Result: {headers.get('Result', '*')}

Moves:
{moves_str}

Please structure your response in Markdown with clear headings. Keep it concise but insightful.
"""
        
        try:
            # Instantiate client here to ensure env vars are loaded
            api_key = os.environ.get("GROQ_API_KEY")
            if not api_key or api_key == "gsk_dummy_key_if_missing":
                raise ValueError("GROQ_API_KEY is missing from environment. Please add it to your .env file.")
                
            client = Groq(api_key=api_key)
            
            # Call Groq API
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                model="llama-3.3-70b-versatile",
                temperature=0.7,
                max_tokens=1024,
            )
            analysis_text = chat_completion.choices[0].message.content
        except Exception as e:
            analysis_text = f"Error generating analysis: {str(e)}"

        return Response({
            'headers': dict(headers),
            'moves': moves_str,
            'analysis': analysis_text,
            'final_fen': board.fen()
        })
