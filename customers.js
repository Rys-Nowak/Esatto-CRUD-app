import { db } from "./config.js";

/**
 * Read all customers' data from the database
 *
 * @returns {Promise<Array>} Array of customer objects
 */
export async function getCustomers() {
    const snapshot = await db
        .collection("customers")
        .get()
        .catch((err) => {
            console.log("Error getting customers data: ", err.message);
        });
    return snapshot.docs.map((doc) => {
        return {
            ...doc.data(),
            "creation date": doc.data()["creation date"]?.toDate(),
        };
    });
}

/**
 * Create a new customer to the database
 *
 * @param {string} name Customer's name
 * @param {string} vatId Customer's VAT identification number
 * @param {string} address Customer's address
 *
 * @typedef {Object} Customer
 * @property {string} name Customer's name
 * @property {string} vatId Customer's VAT identification number
 * @property {string} address Customer's address
 * @property {Date} creationDate Date of addition to the database
 * @property {string} customerId Customer's ID
 * @returns {Promise<Customer>} Added offer
 */
export async function postCustomer(name, vatId, address) {
    const customer = {
        name: name,
        "vat identification number": vatId,
        "creation date": new Date(),
        address: address,
    };

    const docRef = await db
        .collection("customers")
        .add(customer)
        .catch((err) => {
            console.log("Error posting customer data: ", err.message);
        });

    await db
        .collection("customers")
        .doc(docRef.id)
        .update({ customerId: docRef.id })
        .catch((err) => {
            console.log("Error posting customer data (id): ", err.message);
        });

    return {
        ...customer,
        customerId: docRef.id,
    };
}

/**
 * Update a customer's data in the database
 *
 * @param {string} id Customer's ID
 * @param {Object} data Customer's data
 * @param {string} data.name Customer's name
 * @param {string} data.vatId Customer's VAT identification number
 * @param {string} data.address Customer's address
 *
 * @typedef {Object} Customer
 * @property {string} name Customer's name
 * @property {string} vatId Customer's VAT identification number
 * @property {string} address Customer's address
 * @property {Date} creationDate Date of addition to the database
 * @property {string} customerId Customer's ID
 * @returns {Promise<Customer>} Updated customer
 */
export async function updateCustomer(id, data) {
    const customer = {
        name: data.name,
        "vat identification number": data.vatId,
        address: data.address,
    };

    await db
        .collection("customers")
        .doc(id)
        .update(customer)
        .catch((err) => {
            console.log("Error updating customer data: ", err.message);
        });

    return customer;
}

/**
 * Delete a customer from the database
 * @param {string} id Customer's ID
 * 
 * @returns {Promise<void>}
 */
export async function deleteCustomer(id) {
    await db
        .collection("customers")
        .doc(id)
        .delete()
        .catch((err) => {
            console.log("Error deleting customer data: ", err.message);
        });
}
