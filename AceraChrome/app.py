import logging
from flask import Flask, send_file, send_from_directory, jsonify, request
from flask_cors import CORS  # Import CORS module
import subprocess
import os  # Import os module for path operations

app = Flask(__name__, static_url_path='')
app.config['DEBUG'] = True  # Enable Flask debug mode

# Configure logging
logging.basicConfig(level=logging.DEBUG)

CORS(app)  # Enable CORS for all routes

# Serve app.html as the main frontend
@app.route('/')
def home():
    return send_file('app.html')

# Serve app.js for frontend logic
@app.route('/app.js')
def serve_js():
    return send_file('app.js')

# Serve styles.css
@app.route('/styles.css')
def serve_css():
    return send_file('styles.css')

# Serve Acera.png
@app.route('/Acera.png')
def serve_acera_png():
    return send_from_directory(app.static_folder, 'Acera.png')

# Endpoint to activate gesture control
@app.route('/activate-gesture-control', methods=['POST'])
def activate_gesture_control():
    try:
        # Get the path to Gesturecontrol.py (assuming it's in the same directory)
        gesture_control_script = os.path.join(os.path.dirname(__file__), 'Gesturecontrol.py')
        
        # Execute Gesturecontrol.py as a subprocess
        result = subprocess.run(['python3', gesture_control_script], capture_output=True, text=True)

        if result.returncode == 0:
            app.logger.info("Gesture Control activated successfully.")
            return jsonify({'message': 'Gesture Control activated.'}), 200
        else:
            app.logger.error("Failed to activate Gesture Control.")
            return jsonify({'error': 'Failed to activate Gesture Control.'}), 500
    except Exception as e:
        app.logger.error(f"Error activating gesture control: {str(e)}")
        return jsonify({'error': 'Internal Server Error.'}), 500

# Endpoint to activate Acera AI
@app.route('/activate-acera-ai', methods=['POST'])
def activate_acera_ai():
    try:
        # Get the path to aceraai.py (assuming it's in the same directory)
        acera_ai_script = os.path.join(os.path.dirname(__file__), 'aceraai.py')
        
        # Execute aceraai.py as a subprocess
        subprocess.run(['python3', acera_ai_script], check=True)
        
        return jsonify({'message': 'Acera AI activated.'}), 200
    except subprocess.CalledProcessError as e:
        return jsonify({'error': str(e)}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
