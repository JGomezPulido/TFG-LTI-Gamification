import { Router } from "express";

import { authRequired } from "../middlewares/validateToken.js";
import { courseRequired, roleRequired, Roles } from "../middlewares/validateRole.js";
import { 
    createItem,
    getItem, 
    getAllItems, 
    updateItem, 
    deleteItem, 
    getInventory,
    addItemToInventory,
    delItemFromInventory
} from "../controllers/inventory.controller.js";

const router = Router();

router.post(`/item/`, authRequired, courseRequired, roleRequired(Roles.Instructor), createItem);
router.get(`/item/:id`, authRequired, courseRequired, getItem);
router.get(`/item`, authRequired, courseRequired, getAllItems)
router.put(`/item/:id`, authRequired, courseRequired, roleRequired(Roles.Instructor), updateItem);
router.delete(`/item/:id`, authRequired, courseRequired, roleRequired(Roles.Instructor), deleteItem);

router.get(`/inventory/:user`, authRequired, courseRequired, getInventory);
router.put(`/inventory/:user`, authRequired, courseRequired, roleRequired(Roles.Instructor), addItemToInventory);
router.delete(`/inventory/:user`, authRequired, courseRequired, roleRequired(Roles.Instructor), delItemFromInventory);

export default router;