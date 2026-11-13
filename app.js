
const form = document.getElementById("subscriptionForm");
const subscriptionList = document.getElementById("subscriptionList");

const totalSubscriptions = document.getElementById("totalSubscriptions");
const expiredSubscriptions = document.getElementById("expiredSubscriptions");

let subscriptions = JSON.parse(localStorage.getItem("subscriptions")) || [];

function saveSubscriptions() {
    localStorage.setItem("subscriptions", JSON.stringify(subscriptions));
}

function getStatus(renewalDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const renewal = new Date(renewalDate + "T00:00:00");

    return renewal < today ? "Expired" : "Active";
}

if (form) {
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const subscription = {
            service: document.getElementById("service").value,
            provider: document.getElementById("provider").value,
            subscriber: document.getElementById("subscriber").value,
            renewalDate: document.getElementById("renewalDate").value,
            category: document.getElementById("category").value
        };

        subscriptions.push(subscription);

        saveSubscriptions();
        displaySubscriptions();
        form.reset();
    });
}

function displaySubscriptions() {
    if (subscriptionList) {
        subscriptionList.innerHTML = "";

        subscriptions.forEach(function(subscription, index) {
            const row = document.createElement("tr");

            const values = [
                subscription.service,
                subscription.provider,
                subscription.subscriber,
                subscription.renewalDate,
                subscription.category,
                getStatus(subscription.renewalDate)
            ];

            values.forEach(function(value) {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            const actionCell = document.createElement("td");
            const deleteButton = document.createElement("button");

            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", function() {
                deleteSubscription(index);
            });

            actionCell.appendChild(deleteButton);
            row.appendChild(actionCell);

            subscriptionList.appendChild(row);
        });
    }

    updateSummary();
}

function deleteSubscription(index) {
    subscriptions.splice(index, 1);

    saveSubscriptions();
    displaySubscriptions();
}

function updateSummary() {
    if (totalSubscriptions) {
        totalSubscriptions.textContent = subscriptions.length;
    }

    if (expiredSubscriptions) {
        const expired = subscriptions.filter(function(subscription) {
            return getStatus(subscription.renewalDate) === "Expired";
        });

        expiredSubscriptions.textContent = expired.length;
    }
}

displaySubscriptions();

