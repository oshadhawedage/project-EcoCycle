import EwasteItem from "../models/EwasteItem.js";

// Create new e-waste item
export const createEwasteItem = async (req, res) => {
  try {
    const { deviceType, brand, condition, age, weight, disposalType } = req.body;
    const newItem = new EwasteItem({
      deviceType,
      brand,
      condition,
      age,
      weight,
      disposalType,
      owner: req.user._id, // set owner from auth middleware
      
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all e-waste items (with optional filtering)
export const getEwasteItems = async (req, res) => {
  try {
    const { deviceType, page = 1, limit = 10 } = req.query;
    const query = {};

    if (deviceType) query.deviceType = deviceType;

    const items = await EwasteItem.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json(items);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get single e-waste item by ID
export const getEwasteItemById = async (req, res) => {
  try {
    const item = await EwasteItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update item
export const updateEwasteItem = async (req, res) => {
  try {
    const item = await EwasteItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Optional: check owner
    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(item, req.body);
    const updatedItem = await item.save();
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete item
export const deleteEwasteItem = async (req, res) => {
  try {
    const item = await EwasteItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Optional: check owner
    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await item.remove();
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};