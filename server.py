import http.server
import socketserver
import threading
import time
import sys
import subprocess
from datetime import datetime

PORT = 8858

class LottoHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/api/update':
            try:
                print(f"[{datetime.now()}] Manual update triggered...")
                
                # Execute update_lotto.py using current python executable
                print("Running update_lotto.py...")
                subprocess.run([sys.executable, "update_lotto.py"], check=True)
                
                # Execute generate_prediction.py using current python executable
                print("Running generate_prediction.py...")
                subprocess.run([sys.executable, "generate_prediction.py"], check=True)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                response = '{"status": "success", "message": "로또 데이터 및 예측 번호 업데이트 완료!"}'
                self.wfile.write(response.encode('utf-8'))
            except Exception as e:
                print(f"Error updating lotto data: {e}")
                self.send_response(500)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                response = f'{{"status": "error", "message": "{str(e)}"}}'
                self.wfile.write(response.encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def end_headers(self):
        # Disable caching to ensure client gets fresh data
        if self.path.endswith('.json'):
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        super().end_headers()

def run_scheduler():
    # Wait a bit on start before initial run, in case the server is just starting up
    time.sleep(5)
    while True:
        now = datetime.now()
        print(f"[{now}] Running scheduled lotto data update...")
        try:
            subprocess.run([sys.executable, "update_lotto.py"], check=True)
            subprocess.run([sys.executable, "generate_prediction.py"], check=True)
            print(f"[{datetime.now()}] Scheduled update completed successfully.")
        except Exception as e:
            print(f"[{datetime.now()}] Scheduled update failed: {e}")
        
        # Sleep for 12 hours
        time.sleep(12 * 3600)

if __name__ == "__main__":
    # Start scheduler thread
    scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
    scheduler_thread.start()

    # Start HTTP server
    handler = LottoHTTPRequestHandler
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print(f"Serving LottoManager on port {PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
