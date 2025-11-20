import { Router } from "express";
import { cartRepository } from "../storage/cart.repository";
import { isAuthenticated } from "../replitAuth";
import { z } from "zod";

const router = Router();

// Apply authentication middleware to all routes
router.use(isAuthenticated);

router.get("/", async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const result = await cartRepository.getCartWithItems(userId);
    res.json(result);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
});

router.get("/summary", async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const summary = await cartRepository.getCartSummary(userId);
    res.json(summary);
  } catch (error) {
    console.error("Error fetching cart summary:", error);
    res.status(500).json({ message: "Failed to fetch cart summary" });
  }
});

const addItemSchema = z.object({
  productId: z.number(),
  quantity: z.number().positive().default(1),
});

router.post("/items", async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const { productId, quantity } = addItemSchema.parse(req.body);
    
    const item = await cartRepository.addOrUpdateItem(userId, productId, quantity);
    res.json(item);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ message: "Failed to add item to cart" });
  }
});

const updateItemSchema = z.object({
  quantity: z.number().min(0),
});

router.patch("/items/:id", async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const itemId = parseInt(req.params.id);
    const { quantity } = updateItemSchema.parse(req.body);
    
    const item = await cartRepository.updateItemQuantity(userId, itemId, quantity);
    res.json(item);
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Failed to update cart item" });
  }
});

router.delete("/items/:id", async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const itemId = parseInt(req.params.id);
    
    await cartRepository.removeItem(userId, itemId);
    res.json({ success: true });
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({ message: "Failed to remove cart item" });
  }
});

router.delete("/", async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    await cartRepository.clearCart(userId);
    res.json({ success: true });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Failed to clear cart" });
  }
});

export default router;
