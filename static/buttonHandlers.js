function createNewCustomer() {
    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const vatId = document.getElementById("vatId").value;

    if (name === "" || address === "" || vatId === "") {
        alert("Please fill in all fields before submitting");
        return;
    }

    console.log(
        `Creating customer ${name} with address ${address} and VAT ID ${vatId}`
    );

    fetch("http://localhost:3000/api/customers", {
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
            console.error("Error:", error);
            alert("Error creating customer: ", error.message);
        });
}

async function displayCustomers() {
    const customers = await fetch("http://localhost:3000/api/customers", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .catch((error) => {
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

async function editCustomer() {
    let name = document.getElementById("newName").value;
    let address = document.getElementById("newAddress").value;
    const vatId = document.getElementById("idToEdit").value;

    if (name === "") name = undefined;
    if (address === "") address = undefined;
    if (vatId === "") {
        alert("Please fill in the VAT ID field before submitting");
        return;
    }

    console.log(
        `Updating customer with VAT ID ${vatId} to name ${name} and address ${address}`
    );

    fetch(`http://localhost:3000/api/customers/${vatId}`, {
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
            console.error("Error:", error);
            alert("Error updating customer: ", error.message);
        });
}

function deleteCustomer(id) {
    fetch(`http://localhost:3000/api/customers/${id}`, {
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
            console.error("Error:", error);
            alert("Error deleting customer: ", error.message);
        });
}
