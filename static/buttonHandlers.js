const URL = "https://esatto-crud-app.azurewebsites.net/api/customers"
// const URL =  "http://localhost:3000/api/customers";

/**
 * Gets the values from the input fields and sends a POST request to the API
 * to create a new customer.
 */
function createNewCustomer() {
    document.getElementById("add").disabled = true;

    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const vatId = document.getElementById("vatId").value;

    if (name === "" || address === "" || vatId === "") {
        alert("Please fill in all fields before submitting");
        document.getElementById("add").disabled = false;
        return;
    }

    console.log(
        `Creating customer ${name} with address ${address} and VAT ID ${vatId}`
    );

    fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            address,
            vatId,
        }),
    })
        .then((res) => res.json())
        .then((data) => {
            console.log("Success:", data);
            alert(
                `Customer ${data.name} created successfully with id ${data.vatId}`
            );
            window.location.reload();
        })
        .catch((error) => {
            document.getElementById("add").disabled = false;
            console.error("Error:", error);
            alert("Error creating customer: ", error.message);
        });
}

/**
 * Displays all customers in the database.
 */
async function displayCustomers() {
    document.getElementById("show").disabled = true;

    const customers = await fetch(URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .catch((error) => {
            document.getElementById("show").disabled = false;
            console.error("Error:", error);
            alert("Error fetching customers: ", error.message);
        });

    let customersString =
        "<table>\
            <tr>\
                <th>VAT identification number</th>\
                <th>Name</th>\
                <th>Address</th>\
                <th>Creation date</th>\
            </tr>";
    for (const customer of customers) {
        customersString += `
            <tr>
                <td>${customer.vatId}</td>
                <td>${customer.name}</td>
                <td>${customer.address}</td>
                <td>${new Date(customer.creationDate)}</td>
                <td><button onclick="deleteCustomer('${
                    customer.vatId
                }')">Delete</button></td>
            </tr>
        `;
    }
    customersString += "</table>";

    document.getElementById("customers").innerHTML = customersString;
}

/**
 * Gets the VAT Identification Number, name and address from the input fields
 * and sends a PUT request to the API to update the customer with the given
 * VAT Identification Number.
 * If the name or address fields are empty, the corresponding field will not
 * be updated.
 * If the VAT Identification Number field is empty displays an alert.
 */
async function editCustomer() {
    document.getElementById("edit").disabled = true;

    let name = document.getElementById("newName").value;
    let address = document.getElementById("newAddress").value;
    const vatId = document.getElementById("idToEdit").value;

    if (name === "") name = undefined;
    if (address === "") address = undefined;
    if (vatId === "") {
        document.getElementById("edit").disabled = false;
        alert("Please fill in the VAT ID field before submitting");
        return;
    }

    console.log(
        `Updating customer with VAT ID ${vatId} to name ${name} and address ${address}`
    );

    fetch(`${URL}/${vatId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            address,
        }),
    })
        .then((res) => res.json())
        .then((data) => {
            console.log("Success:", data);
            alert(
                `Customer with id ${data.vatId} updated successfully to name ${data.name} and address ${data.address}`
            );
            window.location.reload();
        })
        .catch((error) => {
            document.getElementById("edit").disabled = false;
            console.error("Error:", error);
            alert("Error updating customer: ", error.message);
        });
}

function deleteCustomer(id) {
    document.getElementById("delete").disabled = true;

    fetch(`${URL}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(() => {
            alert(`Customer with id ${id} deleted successfully`);
            window.location.reload();
        })
        .catch((error) => {
            document.getElementById("delete").disabled = false;
            console.error("Error:", error);
            alert("Error deleting customer: ", error.message);
        });
}
