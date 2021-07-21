 var firebaseConfig = {
    apiKey: "AIzaSyAbzs_A4D2D-d7ds64nW9eRXkOu3RXBqho",
    authDomain: "bank-system-5ae92.firebaseapp.com",
    projectId: "bank-system-5ae92",
    storageBucket: "bank-system-5ae92.appspot.com",
    messagingSenderId: "527879553348",
    appId: "1:527879553348:web:b2150c618bb52404211711",
    measurementId: "G-JGMK7TEVBE"
}; 
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const RetrieveData = (classname) => {
	console.log("called");
	document.querySelector(`.${classname}`).innerHTML = "";
	firebase
		.firestore()
		.collection("Bank")
		.get()
		.then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				// doc.data() is never undefined for query doc snapshots
				console.log(doc.data());
				let tr = document.createElement("tr");
				tr.id = doc.id;
				let ID = doc.data().id;
				let name = doc.data().name;
				let amount = doc.data().balance;
				let idtd = document.createElement("td");
				let nametd = document.createElement("td");
				let amounttd = document.createElement("td");
				let idtext = document.createTextNode(ID);
				let nametext = document.createTextNode(name);
				let amounttext = document.createTextNode(amount);
				idtd.appendChild(idtext);
				nametd.appendChild(nametext);
				amounttd.appendChild(amounttext);
				tr.appendChild(idtd);
				tr.appendChild(nametd);
				tr.appendChild(amounttd);
				document.querySelector(`.${classname}`).appendChild(tr);
			});
		})
		.catch((error) => {
			console.log("Error getting documents: ", error);
		});

};

const RetrieveTransactionData = () => {
	console.log("TransactionPage");
	document.querySelector(".transaction").innerHTML = "";

	let sender = document.querySelector('input[name="sender"]').value;
	let reciever = document.querySelector('input[name="reciever"]').value;
	let amount = document.querySelector('input[name="amount"]').value;
	// console.log(sender,reciever,amount)
	firebase
		.firestore()
		.collection("Bank")

		.get()
		.then((querySnapshot) => {
			if (sender > querySnapshot.size || reciever > querySnapshot.size) {
				alert("Please Enter valid Sender or reciver Id");
			} else {
				querySnapshot.forEach((doc) => {
					if (doc.data().id === sender * 1) {
						console.log(doc.data().id);
						if (doc.data().balance >= amount) reduceAmount(doc.id, amount, doc.data().balance);
						else {
							alert("Insufficient Funds");
							location.reload();
						}
					}
					if (doc.data().id === reciever * 1) {
						console.log(doc.data().id);
						updateAmount(doc.id, amount, doc.data().balance);
					}
				});
				firebase.firestore().collection("transactions").add({
					from: sender,
					to: reciever,
					amount: amount,
					time: firebase.firestore.FieldValue.serverTimestamp(),
				});
				document.querySelector(".CustomerPage").setAttribute("hidden", true);
				document.querySelector(".transactionHistory").removeAttribute("hidden");
			}
			loadCustomerData();
		});
};

const loadCustomerData = () => {
	firebase
		.firestore()
		.collection("transactions")
		.orderBy("time", "desc")
		.get()
		.then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				// doc.data() is never undefined for query doc snapshots
				console.log(doc.data());
				let tr = document.createElement("tr");
				tr.id = doc.id;
				let ID = doc.data().from;
				let name = doc.data().to;
				let amount = doc.data().amount;
				let idtd = document.createElement("td");
				let nametd = document.createElement("td");
				let amounttd = document.createElement("td");
				let idtext = document.createTextNode(ID);
				let nametext = document.createTextNode(name);
				let amounttext = document.createTextNode(amount);
				idtd.appendChild(idtext);
				nametd.appendChild(nametext);
				amounttd.appendChild(amounttext);
				tr.appendChild(idtd);
				tr.appendChild(nametd);
				tr.appendChild(amounttd);
				document.querySelector(".transaction").appendChild(tr);
			});
		})
		.catch((error) => {
			console.log("Error getting documents: ", error);
		});
};

const updateAmount = (id, amount, originalAmount) => {
	firebase
		.firestore()
		.collection("Bank")
		.doc(id)
		.update({
			balance: originalAmount * 1 + amount * 1,
		});
};
const reduceAmount = (id, amount, originalAmount) => {
	firebase
		.firestore()
		.collection("Bank")
		.doc(id)
		.update({
			balance: originalAmount - amount,
		});
};

const showThanks = () => {
    console.log("showthanks")
	document.querySelector(".showData").setAttribute("hidden", true);
	document.querySelector(".ThankYou").removeAttribute("hidden");
};

const goHome = () => {
	location.reload();
};
