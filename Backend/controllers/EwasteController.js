import EwasteItem from "../models/EwasteItem.js";

// Create new e-waste item
export const createEwasteItem = async (req, res) => {

  console.log("Mock user:", req.user);
  try {
    // 🔐 Role check
    if (req.user.role !== "user") {
      return res.status(403).json({
        message: "Only users can create e-waste items",
      });
    }

    const { deviceType, brand, condition, age, weight, disposalType } = req.body;

    // 🛑 Basic validation
    if (!deviceType || !brand || !condition || age == null || !weight || !disposalType) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const newItem = new EwasteItem({
      deviceType,
      brand,
      condition,
      age,
      weight,
      disposalType,
      owner: req.user._id,
      status: "available", // enforce default status
    });

    const savedItem = await newItem.save();

    res.status(201).json(savedItem);

  } catch (error) {
    res.status(500).json({
      message: "Server error while creating item",
      error: error.message,
    });
  }
};



// Get all e-waste items (with optional filtering)
export const getEwasteItems = async (req, res) => {
  try {
    const { deviceType } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    let query = {};

    // 🔐 Role-based filtering
    if (req.user.role === "user") {
      query.owner = req.user._id;
    }

    else if (req.user.role === "recycler") {
      query.status = "available";
    }

    else if (req.user.role === "admin") {
      // admin sees everything
    }

    else {
      return res.status(403).json({
        message: "Invalid role",
      });
    }

    // 🔎 Optional filter
    if (deviceType) {
      query.deviceType = deviceType;
    }

    const items = await EwasteItem.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await EwasteItem.countDocuments(query);

    res.status(200).json({
      total,
      page,
      pages: Math.ceil(total / limit),
      data: items,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching items",
      error: error.message,
    });
  }
};




// Get single e-waste item by ID
export const getEwasteItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await EwasteItem.findById(id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    // 🔐 Role-based access control

    // 👤 User → only own item
    if (req.user.role === "user") {
      if (item.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          message: "Not authorized to view this item",
        });
      }
    }

    // ♻ Recycler → only available items
    else if (req.user.role === "recycler") {
      if (item.status !== "available") {
        return res.status(403).json({
          message: "Recycler can only view available items",
        });
      }
    }

    // 👑 Admin → full access (no restriction)

    else if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Invalid role",
      });
    }

    res.status(200).json(item);

  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching item",
      error: error.message,
    });
  }
};

// Update item
export const updateEwasteItem = async (req, res) => {
  try {
    const item = await EwasteItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // 👑 Admin → full access
    if (req.user.role === "admin") {
      Object.assign(item, req.body);
      const updatedItem = await item.save();
      return res.status(200).json(updatedItem);
    }

    // 👤 User → only own items
    if (req.user.role === "user") {
      if (item.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }

      // Prevent user from setting status = recycled
      if (req.body.status === "recycled") {
        return res.status(403).json({ message: "Only admin can mark as recycled" });
      }

      // Allow updates to other fields
      Object.assign(item, req.body);
      const updatedItem = await item.save();
      return res.status(200).json(updatedItem);
    }

    // ♻ Recycler → can only update status to picked-up
    if (req.user.role === "recycler") {
      if (req.body.status !== "picked-up") {
        return res.status(403).json({ message: "Recycler can only mark items as picked-up" });
      }

      item.status = "picked-up";
      const updatedItem = await item.save();
      return res.status(200).json(updatedItem);
    }

    // Invalid role
    return res.status(403).json({ message: "Invalid role" });

  } catch (error) {
    res.status(500).json({ message: "Server error while updating item", error: error.message });
  }
};



// Delete item
export const deleteEwasteItem = async (req, res) => {
  try {
    const item = await EwasteItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // 👑 Admin → can delete any item
    if (req.user.role === "admin") {
      await item.deleteOne();
      return res.status(200).json({ message: "Item deleted successfully by admin" });
    }

    // 👤 User → can delete own items only
    if (req.user.role === "user") {
      if (item.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized to delete this item" });
      }

      await item.deleteOne();
      return res.status(200).json({ message: "Item deleted successfully" });
    }

    // ♻ Recycler → cannot delete
    if (req.user.role === "recycler") {
      return res.status(403).json({ message: "Recycler cannot delete items" });
    }

    // Invalid role
    return res.status(403).json({ message: "Invalid role" });

  } catch (error) {
    res.status(500).json({
      message: "Server error while deleting item",
      error: error.message,
    });
  }
};