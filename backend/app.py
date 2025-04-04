from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
import logging
from datetime import datetime
from pymongo import MongoClient

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# MongoDB connection setup
try:
    mongo_uri = os.environ.get('MONGODB_URI', 'mongodb://localhost:27017/iss_cargo_db')
    client = MongoClient(mongo_uri)
    db = client['iss_cargo_db']
    logger.info("Connected to MongoDB successfully")
except Exception as e:
    logger.error(f"Failed to connect to MongoDB: {e}")
    db = None

# Collections
cargo_collection = db['cargo_items'] if db else None
waste_collection = db['waste_items'] if db else None
logs_collection = db['activity_logs'] if db else None

# Helpers
def log_activity(user_id, action_type, item_id, item_name, location):
    if logs_collection:
        logs_collection.insert_one({
            "user_id": user_id,
            "action_type": action_type,
            "item_id": item_id,
            "item_name": item_name,
            "location": location,
            "timestamp": datetime.utcnow()
        })

# API Endpoints
@app.route('/api/placement', methods=['POST'])
def get_placement_recommendations():
    try:
        recommendations = {
            "module": "Columbus", "section": "C4", "location": "Shelf-3", "confidence": 92,
            "alternatives": [
                {"module": "Destiny", "section": "D2", "location": "Cabinet-1", "confidence": 87},
                {"module": "Harmony", "section": "H5", "location": "Drawer-9", "confidence": 73}
            ]
        }
        return jsonify(recommendations)
    except Exception as e:
        logger.error(f"Error in placement recommendations: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/search', methods=['GET'])
def search_items():
    try:
        item_id = request.args.get('itemId')
        item_name = request.args.get('itemName')
        user_id = request.args.get('userId')
        query = {}
        if item_id:
            query["item_id"] = item_id
        if item_name:
            query["name"] = {"$regex": item_name, "$options": "i"}
        results = list(cargo_collection.find(query, {"_id": 0})) if cargo_collection else []
        if results and user_id:
            for item in results:
                log_activity(user_id, "retrieval", item.get("item_id", ""), item.get("name", ""), item.get("module", ""))
        return jsonify(results)
    except Exception as e:
        logger.error(f"Error in item search: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/waste/identify', methods=['GET'])
def identify_waste():
    try:
        waste_data = {"categories": [{"type": "Biological", "amount": 25}, {"type": "Packaging", "amount": 42}], "total": 123}
        return jsonify(waste_data)
    except Exception as e:
        logger.error(f"Error in waste identification: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/simulate/day', methods=['POST'])
def simulate_day():
    try:
        if logs_collection:
            logs_collection.insert_one({
                "user_id": request.json.get("userId", "system"),
                "action_type": "simulation",
                "details": "Day simulation",
                "timestamp": datetime.utcnow()
            })
        return jsonify({"success": True, "message": "Day simulation completed"})
    except Exception as e:
        logger.error(f"Error in day simulation: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/import/items', methods=['POST'])
def import_items():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
        file = request.files['file']
        if not file.filename.endswith('.csv'):
            return jsonify({"error": "File must be CSV format"}), 400
        df = pd.read_csv(file)
        result = {"success": True, "itemsProcessed": len(df), "itemsAdded": int(len(df) * 0.75), "itemsUpdated": int(len(df) * 0.25)}
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error in import: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/logs', methods=['GET'])
def get_logs():
    try:
        start_date = request.args.get('startDate')
        end_date = request.args.get('endDate')
        if not start_date or not end_date:
            return jsonify({"error": "Start and end dates are required"}), 400
        start = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
        end = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
        query = {"timestamp": {"$gte": start, "$lte": end}}
        results = list(logs_collection.find(query, {"_id": 0})) if logs_collection else []
        for log in results:
            if "timestamp" in log:
                log["timestamp"] = log["timestamp"].isoformat()
        return jsonify(results)
    except Exception as e:
        logger.error(f"Error in logs retrieval: {e}")
        return jsonify({"error": str(e)}), 500

# Main entry point
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
