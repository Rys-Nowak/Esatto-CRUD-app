import { db } from "./config.js";

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

export async function deleteCustomer(id) {
    await db
        .collection("customers")
        .doc(id)
        .delete()
        .catch((err) => {
            console.log("Error deleting customer data: ", err.message);
        });
}
