import { db } from "../firebase/config.js";
import express from "express";

const router = express.Router();

/**
 * Reads all customers' data from the database
 * If there is an error, sends 500 status code and error message
 * @param {express.Request} req
 * @param {express.Response} res
 *
 * @typedef {Object} Customer
 * @property {string} name Customer's name
 * @property {string} vatId Customer's VAT identification number
 * @property {string} address Customer's address
 * @property {Date} creationDate Date of addition to the database
 * @returns {Array<Customer>} Array of Customer objects
 */
export async function getCustomers(req, res) {
    const snapshot = await db
        .collection("customers")
        .get()
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });

    res.send(
        snapshot.docs.map((doc) => {
            return {
                ...doc.data(),
                creationDate: doc.data().creationDate?.toDate(),
            };
        })
    );
}

/**
 * Creates a new customer to the database, sends their data in response
 * If there is an error, sends 500 status code and error message
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {string} req.body.name Customer's name
 * @param {string} req.body.vatId Customer's VAT identification number
 * @param {string} req.body.address Customer's address
 *
 * @typedef {Object} Customer
 * @property {string} name Customer's name
 * @property {string} vatId Customer's VAT identification number
 * @property {string} address Customer's address
 * @property {Date} creationDate Date of addition to the database
 * @returns {Customer} Added customer
 */
export function postCustomer(req, res) {
    const customer = {
        name: req.body.name,
        vatId: req.body.vatId,
        creationDate: new Date(),
        address: req.body.address,
    };

    db.collection("customers")
        .doc(customer.vatId)
        .get()
        .then((doc) => {
            if (doc.exists) {
                res.status(400).send({ message: "Customer already exists" });
            } else {
                db.collection("customers")
                    .doc(customer.vatId)
                    .set(customer)
                    .then(() => {
                        res.send(customer);
                    })
                    .catch((err) => {
                        res.send({ message: err.message });
                    });
            }
        });
}

/**
 * Updates a customer's data in the database, sends their data in respnose
 * If there is an error, sends 500 status code and error message
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {string} req.body.name Customer's name
 * @param {string} req.body.address Customer's address
 * @property {string} req.params.id Customer's VAT identification number
 *
 * @typedef {Object} Customer
 * @property {string} name Customer's name
 * @property {string} vatId Customer's VAT identification number
 * @property {string} address Customer's address
 * @property {Date} creationDate Date of addition to the database
 * @returns {Customer} Updated customer
 */
export async function updateCustomer(req, res) {
    const id = req.params.id;
    const data = req.body;
    const customer = {
        name: data.name,
        address: data.address,
    };

    await db
        .collection("customers")
        .doc(id)
        .get()
        .then(async (docSnap) => {
            if (docSnap.exists) {
                await db
                    .collection("customers")
                    .doc(id)
                    .update(customer)
                    .catch((err) => {
                        res.status(500).send({ message: err.message });
                    });
            } else {
                res.status(404).send({ message: "Customer not found" });
            }
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });

    await db
        .collection("customers")
        .doc(id)
        .get()
        .then((docSnap) => {
            res.send({
                ...docSnap.data(),
                creationDate: docSnap.data().creationDate?.toDate(),
            });
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
}

/**
 * Deletes a customer from the database
 * If there is an error, sends 500 status code and error message
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {string} req.params.id Customer's VAT identification number
 */
export async function deleteCustomer(req, res) {
    const id = req.params.id;
    await db
        .collection("customers")
        .doc(id)
        .delete()
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });

    res.sendStatus(200);
}

router.post("/", postCustomer);
router.get("/", getCustomers);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);

export default router;
