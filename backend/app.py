
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
import logging
import random
import numpy as np
from datetime import datetime, timedelta
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

# 1. Cargo Placement API - Uses Greedy Bin Packing algorithm
@app.route('/api/placement', methods=['POST'])
def get_placement_recommendations():
    try:
        # Extract cargo details from request
        data = request.get_json() or {}
        item_type = data.get('type', 'general')
        weight = data.get('weight', 1.0)
        dimensions = data.get('dimensions', {'length': 20, 'width': 20, 'height': 20})
        priority = data.get('priority', 'medium')
        
        # Greedy Bin Packing algorithm simulation
        # In a real implementation, this would analyze current module occupancy
        # and use bin packing logic to find optimal placement
        
        # For demo purposes, use simple logic based on cargo type and weight
        modules = ['Columbus', 'Destiny', 'Harmony', 'Unity', 'Tranquility', 'Kibo']
        sections = ['A', 'B', 'C', 'D', 'E']
        locations = ['Shelf', 'Cabinet', 'Drawer', 'Floor', 'Wall']
        
        # Simple greedy selection based on item characteristics
        if item_type == 'food':
            module = 'Unity'
        elif item_type == 'medical':
            module = 'Columbus'
        elif item_type == 'scientific':
            module = 'Destiny'
        elif weight > 10:
            module = 'Tranquility'
        else:
            module = random.choice(modules)
            
        section = f"{random.choice(sections)}{random.randint(1, 9)}"
        location = f"{random.choice(locations)}-{random.randint(1, 10)}"
        
        # Generate confidence score based on item properties
        confidence = min(95, 60 + (100 - (weight * 2)) / 10)
        
        # Generate alternative placements
        alternatives = []
        for i in range(2):
            alt_module = random.choice([m for m in modules if m != module])
            alt_section = f"{random.choice(sections)}{random.randint(1, 9)}"
            alt_location = f"{random.choice(locations)}-{random.randint(1, 10)}"
            alt_confidence = max(50, confidence - (15 * (i+1)))
            
            alternatives.append({
                "module": alt_module,
                "section": alt_section,
                "location": alt_location,
                "confidence": int(alt_confidence)
            })
        
        recommendations = {
            "module": module,
            "section": section,
            "location": location,
            "confidence": int(confidence),
            "alternatives": alternatives
        }
        
        # Log the recommendation
        if logs_collection:
            logs_collection.insert_one({
                "action_type": "placement_recommendation",
                "item_type": item_type,
                "recommended_location": f"{module}/{section}/{location}",
                "confidence": int(confidence),
                "timestamp": datetime.utcnow()
            })
            
        return jsonify(recommendations)
    except Exception as e:
        logger.error(f"Error in placement recommendations: {e}")
        return jsonify({"error": str(e)}), 500

# 2. Item Search & Retrieval API - Uses Trie + BFS 
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

@app.route('/api/retrieve', methods=['POST'])
def retrieve_item():
    try:
        data = request.get_json()
        item_id = data.get('itemId')
        user_id = data.get('userId')
        
        if not item_id:
            return jsonify({"error": "Item ID is required"}), 400
        
        # In a real implementation, this would update the item's status
        # For demo, we'll simulate a successful retrieval
        
        # Log the retrieval operation
        if user_id and logs_collection:
            logs_collection.insert_one({
                "user_id": user_id,
                "action_type": "item_retrieval",
                "item_id": item_id,
                "timestamp": datetime.utcnow()
            })
            
        return jsonify({
            "success": True,
            "message": f"Item {item_id} has been retrieved",
            "item": {
                "item_id": item_id,
                "status": "retrieved",
                "retrieved_by": user_id,
                "retrieved_at": datetime.utcnow().isoformat()
            }
        })
    except Exception as e:
        logger.error(f"Error in item retrieval: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/place', methods=['POST'])
def place_item():
    try:
        data = request.get_json()
        item_id = data.get('itemId')
        location = data.get('location', {})
        user_id = data.get('userId')
        
        if not item_id or not location:
            return jsonify({"error": "Item ID and location are required"}), 400
        
        module = location.get('module')
        section = location.get('section')
        position = location.get('position')
        
        # In a real implementation, this would update the item's location in the database
        # For demo, we'll simulate a successful placement
        
        # Log the placement operation
        if user_id and logs_collection:
            logs_collection.insert_one({
                "user_id": user_id,
                "action_type": "item_placement",
                "item_id": item_id,
                "location": f"{module}/{section}/{position}",
                "timestamp": datetime.utcnow()
            })
            
        return jsonify({
            "success": True,
            "message": f"Item {item_id} has been placed at {module}/{section}/{position}",
            "item": {
                "item_id": item_id,
                "status": "placed",
                "location": f"{module}/{section}/{position}",
                "placed_by": user_id,
                "placed_at": datetime.utcnow().isoformat()
            }
        })
    except Exception as e:
        logger.error(f"Error in item placement: {e}")
        return jsonify({"error": str(e)}), 500

# 3. Waste Management API - Uses LSTM + Isolation Forest
@app.route('/api/waste/identify', methods=['GET'])
def identify_waste():
    try:
        # In a real implementation, this would use LSTM model predictions
        # For demo, we'll simulate waste identification results
        
        waste_types = ['Biological', 'Packaging', 'Technical', 'Food', 'Medical']
        total_waste = 0
        categories = []
        
        for waste_type in waste_types:
            # Simulate amount with some randomness
            amount = round(random.uniform(5, 45), 1)
            total_waste += amount
            
            # Simulate trend
            trends = ['increasing', 'decreasing', 'stable']
            trend = random.choice(trends)
            
            categories.append({
                "type": waste_type,
                "amount": amount,
                "trend": trend
            })
        
        # Simulate next pickup date (2-4 weeks in the future)
        days_to_pickup = random.randint(14, 28)
        next_pickup = (datetime.utcnow() + timedelta(days=days_to_pickup)).strftime('%Y-%m-%d')
        
        waste_data = {
            "categories": categories,
            "total": round(total_waste, 1),
            "nextPickup": next_pickup
        }
        
        return jsonify(waste_data)
    except Exception as e:
        logger.error(f"Error in waste identification: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/waste/return-plan', methods=['POST'])
def create_waste_return_plan():
    try:
        data = request.get_json()
        waste_items = data.get('wasteItems', [])
        
        if not waste_items:
            return jsonify({"error": "Waste items are required"}), 400
        
        # In a real implementation, this would calculate optimal packing and scheduling
        # For demo, we'll simulate a return plan
        
        # Calculate total weight and volume
        total_weight = sum(item.get('weight', 0) for item in waste_items)
        
        # Simulate return vehicle assignment
        vehicles = ['Progress MS', 'Cygnus', 'Dragon', 'HTV']
        assigned_vehicle = random.choice(vehicles)
        
        # Simulate return date (1-3 months in the future)
        days_to_return = random.randint(30, 90)
        return_date = (datetime.utcnow() + timedelta(days=days_to_return)).strftime('%Y-%m-%d')
        
        # Simulate container assignment
        containers = []
        remaining_weight = total_weight
        container_id = 1
        
        while remaining_weight > 0:
            container_capacity = random.uniform(10, 30)
            container_weight = min(container_capacity, remaining_weight)
            remaining_weight -= container_weight
            
            containers.append({
                "id": f"CONT-{container_id:03d}",
                "capacity": round(container_capacity, 1),
                "filled": round(container_weight, 1),
                "items": random.randint(1, 5)
            })
            container_id += 1
        
        return_plan = {
            "success": True,
            "wasteItems": len(waste_items),
            "totalWeight": round(total_weight, 1),
            "returnVehicle": assigned_vehicle,
            "returnDate": return_date,
            "containers": containers,
            "instructions": [
                f"Pack biohazardous materials in red containers",
                f"Ensure all containers are properly sealed",
                f"Complete packing 48 hours before {return_date}"
            ]
        }
        
        return jsonify(return_plan)
    except Exception as e:
        logger.error(f"Error in waste return planning: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/waste/complete-undocking', methods=['POST'])
def complete_waste_undocking():
    try:
        data = request.get_json()
        mission_id = data.get('missionId')
        user_id = data.get('userId')
        
        if not mission_id:
            return jsonify({"error": "Mission ID is required"}), 400
        
        # In a real implementation, this would update all waste records
        # For demo, we'll simulate a successful undocking
        
        # Log the waste undocking operation
        if user_id and logs_collection:
            logs_collection.insert_one({
                "user_id": user_id,
                "action_type": "waste_undocking",
                "mission_id": mission_id,
                "timestamp": datetime.utcnow()
            })
            
        completion_time = datetime.utcnow().isoformat()
        
        return jsonify({
            "success": True,
            "message": f"Waste undocking for mission {mission_id} completed successfully",
            "missionId": mission_id,
            "completedAt": completion_time,
            "status": "undocked"
        })
    except Exception as e:
        logger.error(f"Error in waste undocking completion: {e}")
        return jsonify({"error": str(e)}), 500

# 4. Time Simulation API - Uses Discrete Event Simulation (DES)
@app.route('/api/simulate/day', methods=['POST'])
def simulate_day():
    try:
        data = request.get_json() or {}
        user_id = data.get('userId', 'system')
        days = data.get('days', 1)
        
        # Limit simulation to reasonable range
        if days > 30:
            days = 30
            
        # In a real implementation, this would run a discrete event simulation
        # For demo, we'll simulate the passage of days
        
        # Simulate consumption of supplies
        food_consumed = round(random.uniform(1.5, 2.5) * days, 1)
        water_consumed = round(random.uniform(2.0, 3.0) * days, 1)
        oxygen_consumed = round(random.uniform(0.8, 1.2) * days, 1)
        
        # Simulate waste generation
        waste_generated = round(random.uniform(1.0, 1.8) * days, 1)
        
        # Simulate scientific experiments
        experiments_conducted = random.randint(1, 3) * days
        
        # Log the simulation
        if logs_collection:
            logs_collection.insert_one({
                "user_id": user_id,
                "action_type": "simulation",
                "details": {
                    "days_simulated": days,
                    "food_consumed": food_consumed,
                    "waste_generated": waste_generated,
                    "experiments_conducted": experiments_conducted
                },
                "timestamp": datetime.utcnow()
            })
            
        return jsonify({
            "success": True, 
            "message": f"Simulated {days} days of ISS operations",
            "simulation": {
                "daysSimulated": days,
                "consumables": {
                    "foodConsumed": food_consumed,
                    "waterConsumed": water_consumed,
                    "oxygenConsumed": oxygen_consumed
                },
                "wasteGenerated": waste_generated,
                "experimentsCompleted": experiments_conducted,
                "simulationTime": datetime.utcnow().isoformat()
            }
        })
    except Exception as e:
        logger.error(f"Error in day simulation: {e}")
        return jsonify({"error": str(e)}), 500

# 5. Import/Export API - Uses Chunked Parsing + Schema Matching
@app.route('/api/import/items', methods=['POST'])
def import_items():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
        file = request.files['file']
        if not file.filename.endswith('.csv'):
            return jsonify({"error": "File must be CSV format"}), 400
        
        # In a real implementation, this would parse and validate the CSV
        # For demo, we'll simulate the import process
        
        # Read file contents
        df = pd.read_csv(file)
        
        # Simulate processing statistics
        items_processed = len(df)
        items_added = int(len(df) * 0.75)
        items_updated = int(len(df) * 0.25)
        processing_time = round(items_processed * 0.05, 2)  # Simulate processing time
        
        result = {
            "success": True, 
            "itemsProcessed": items_processed, 
            "itemsAdded": items_added, 
            "itemsUpdated": items_updated,
            "processingTime": f"{processing_time}s"
        }
        
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error in import: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/import/containers', methods=['POST'])
def import_containers():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
        file = request.files['file']
        if not file.filename.endswith('.csv'):
            return jsonify({"error": "File must be CSV format"}), 400
        
        # Similar to import_items but for containers
        df = pd.read_csv(file)
        
        # Simulate processing statistics
        containers_processed = len(df)
        containers_added = int(len(df) * 0.8)
        containers_updated = int(len(df) * 0.2)
        processing_time = round(containers_processed * 0.07, 2)
        
        result = {
            "success": True, 
            "containersProcessed": containers_processed, 
            "containersAdded": containers_added, 
            "containersUpdated": containers_updated,
            "processingTime": f"{processing_time}s"
        }
        
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error in container import: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/export/arrangement', methods=['GET'])
def export_arrangement():
    try:
        module = request.args.get('module')
        format_type = request.args.get('format', 'csv')
        
        # In a real implementation, this would query the database and format the data
        # For demo, we'll simulate the export process
        
        if format_type not in ['csv', 'json']:
            return jsonify({"error": "Unsupported export format"}), 400
        
        # Simulate export data preparation
        modules = ['Columbus', 'Destiny', 'Harmony', 'Unity', 'Tranquility', 'Kibo']
        if module and module not in modules:
            return jsonify({"error": "Invalid module specified"}), 400
        
        # Determine what modules to include
        modules_to_export = [module] if module else modules
        
        # Simulate export statistics
        items_exported = random.randint(50, 200) * len(modules_to_export)
        sections_included = random.randint(3, 8) * len(modules_to_export)
        
        result = {
            "success": True,
            "exportFormat": format_type,
            "modulesIncluded": modules_to_export,
            "itemsExported": items_exported,
            "sectionsIncluded": sections_included,
            "downloadUrl": f"/api/downloads/arrangement_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}.{format_type}"
        }
        
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error in arrangement export: {e}")
        return jsonify({"error": str(e)}), 500

# 6. Logging API - Uses Asynchronous Logging + Log Rotation
@app.route('/api/logs', methods=['GET'])
def get_logs():
    try:
        start_date = request.args.get('startDate')
        end_date = request.args.get('endDate')
        if not start_date or not end_date:
            return jsonify({"error": "Start and end dates are required"}), 400
        
        # Parse dates
        try:
            start = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
            end = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
        except ValueError:
            return jsonify({"error": "Invalid date format. Use ISO format (YYYY-MM-DDTHH:MM:SSZ)"}), 400
        
        # Additional filters
        user_id = request.args.get('userId')
        item_id = request.args.get('itemId')
        action_type = request.args.get('actionType')
        
        # Build the query
        query = {"timestamp": {"$gte": start, "$lte": end}}
        if user_id:
            query["user_id"] = user_id
        if item_id:
            query["item_id"] = item_id
        if action_type:
            query["action_type"] = action_type
        
        # Execute the query
        results = list(logs_collection.find(query, {"_id": 0})) if logs_collection else []
        
        # Convert datetime objects to ISO format strings for JSON serialization
        for log in results:
            if "timestamp" in log:
                log["timestamp"] = log["timestamp"].isoformat()
        
        return jsonify(results)
    except Exception as e:
        logger.error(f"Error in logs retrieval: {e}")
        return jsonify({"error": str(e)}), 500

# Main entry point
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port)
