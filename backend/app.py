
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
    """Log an activity in the database"""
    if not logs_collection:
        logger.error("Cannot log activity: No database connection")
        return
    
    logs_collection.insert_one({
        "user_id": user_id,
        "action_type": action_type,
        "item_id": item_id,
        "item_name": item_name,
        "location": location,
        "timestamp": datetime.utcnow()
    })

# 1. Placement Recommendations API
@app.route('/api/placement', methods=['POST'])
def get_placement_recommendations():
    """Get AI recommendations for cargo placement"""
    try:
        data = request.json
        
        # In a real app, this would use a machine learning model
        # For demo, return some static recommendations
        
        recommendations = {
            "module": "Columbus",
            "section": "C4",
            "location": "Shelf-3",
            "confidence": 92,
            "alternatives": [
                {"module": "Destiny", "section": "D2", "location": "Cabinet-1", "confidence": 87},
                {"module": "Harmony", "section": "H5", "location": "Drawer-9", "confidence": 73}
            ],
            "reasoning": [
                "Based on cargo dimensions and available space",
                "Proximity to related items",
                "Optimal for access frequency requirements"
            ]
        }
        
        return jsonify(recommendations)
    
    except Exception as e:
        logger.error(f"Error in placement recommendations: {e}")
        return jsonify({"error": str(e)}), 500

# 2. Item Search and Retrieval API
@app.route('/api/search', methods=['GET'])
def search_items():
    """Search for items by ID or name"""
    try:
        item_id = request.args.get('itemId')
        item_name = request.args.get('itemName')
        user_id = request.args.get('userId')
        
        if not item_id and not item_name:
            return jsonify({"error": "Either itemId or itemName must be provided"}), 400
        
        # Build query
        query = {}
        if item_id:
            query["item_id"] = item_id
        if item_name:
            query["name"] = {"$regex": item_name, "$options": "i"}  # Case-insensitive search
        
        # Query database
        if cargo_collection:
            results = list(cargo_collection.find(query, {"_id": 0}))
            
            # Log retrieval
            if results and user_id:
                for item in results:
                    log_activity(
                        user_id=user_id,
                        action_type="retrieval",
                        item_id=item.get("item_id", ""),
                        item_name=item.get("name", ""),
                        location=f"{item.get('module', '')}/{item.get('section', '')}"
                    )
            
            return jsonify(results)
        else:
            # Demo fallback
            return jsonify([
                {"id": "ITM-1243", "name": "Protein Bar Box", "type": "food", 
                 "location": "Unity/A3/Shelf-2", "lastAccess": "2025-03-15"},
                {"id": "ITM-9857", "name": "Water Filter Kit", "type": "equipment", 
                 "location": "Destiny/B7/Cabinet-4", "lastAccess": "2025-02-22"}
            ])
    
    except Exception as e:
        logger.error(f"Error in item search: {e}")
        return jsonify({"error": str(e)}), 500

# 3. Waste Management API
@app.route('/api/waste/identify', methods=['GET'])
def identify_waste():
    """Identify and categorize waste"""
    try:
        # In a real app, this would connect to sensors or computer vision
        waste_data = {
            "categories": [
                {"type": "Biological", "amount": 25, "trend": "increasing"},
                {"type": "Packaging", "amount": 42, "trend": "stable"},
                {"type": "Technical", "amount": 18, "trend": "decreasing"},
                {"type": "Food", "amount": 30, "trend": "stable"},
                {"type": "Medical", "amount": 8, "trend": "increasing"}
            ],
            "total": 123,
            "nextPickup": "2025-04-15"
        }
        
        return jsonify(waste_data)
    
    except Exception as e:
        logger.error(f"Error in waste identification: {e}")
        return jsonify({"error": str(e)}), 500

# 4. Time Simulation API
@app.route('/api/simulate/day', methods=['POST'])
def simulate_day():
    """Simulate the passage of one day on the station"""
    try:
        # In a real app, this would update inventory status, simulate usage, etc.
        
        # Log simulation
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

# 5. Import/Export API
@app.route('/api/import/items', methods=['POST'])
def import_items():
    """Import items from CSV file"""
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
        
        if not file.filename.endswith('.csv'):
            return jsonify({"error": "File must be CSV format"}), 400
        
        # Process CSV file
        df = pd.read_csv(file)
        
        # In a real app, this would validate and insert into MongoDB
        result = {
            "success": True,
            "itemsProcessed": len(df),
            "itemsAdded": int(len(df) * 0.75),
            "itemsUpdated": int(len(df) * 0.25),
            "errors": 0,
            "warnings": []
        }
        
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"Error in import: {e}")
        return jsonify({"error": str(e)}), 500

# 6. Logging API
@app.route('/api/logs', methods=['GET'])
def get_logs():
    """Get activity logs filtered by date range and other parameters"""
    try:
        start_date = request.args.get('startDate')
        end_date = request.args.get('endDate')
        item_id = request.args.get('itemId')
        user_id = request.args.get('userId')
        action_type = request.args.get('actionType')
        
        if not start_date or not end_date:
            return jsonify({"error": "Start and end dates are required"}), 400
        
        # Parse dates
        start = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
        end = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
        
        # Build query
        query = {
            "timestamp": {
                "$gte": start,
                "$lte": end
            }
        }
        
        if item_id:
            query["item_id"] = item_id
        if user_id:
            query["user_id"] = user_id
        if action_type:
            query["action_type"] = action_type
        
        # Query database
        if logs_collection:
            results = list(logs_collection.find(query, {"_id": 0}))
            
            # Convert datetime objects to strings for JSON serialization
            for log in results:
                if "timestamp" in log:
                    log["timestamp"] = log["timestamp"].isoformat()
            
            return jsonify(results)
        else:
            # Mock data for demo
            return jsonify([
                {"id": 1, "timestamp": "2025-04-02T14:32:15Z", "user": "Astronaut Zhang", 
                 "action": "placement", "item": "Medical Kit #42", "location": "Columbus/B3"},
                {"id": 2, "timestamp": "2025-04-02T11:18:42Z", "user": "Astronaut Johnson", 
                 "action": "retrieval", "item": "Tool Set T-15", "location": "Unity/A2"}
            ])
    
    except Exception as e:
        logger.error(f"Error in logs retrieval: {e}")
        return jsonify({"error": str(e)}), 500

# Main entry point
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
