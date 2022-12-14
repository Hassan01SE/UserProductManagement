import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import io from 'socket.io-client';
import { LineWave } from 'react-loader-spinner';
import { useAuth } from "./auth";
import { v4 as uuidv4 } from 'uuid';


const Share = () => {

    const { id } = useParams();

    const auth = useAuth();
    //const name = auth.user;

    const [name, setname] = useState(() => {
        // getting stored value
        const saved = sessionStorage.getItem("name");
        const initialValue = JSON.parse(saved);
        return initialValue || auth.user;
    });




    const [user, setUser] = useState([""])

    const [product, setProduct] = useState([""])
    const [sender, setsender] = useState([""])

    document.title = "Product Share";
    const socket = io.connect("http://localhost:5000");
    useEffect(() => {
        setTimeout(() => {
            fetch('http://localhost:8000/user')
                .then((res) => {

                    return res.json();
                })
                .then((data) => {
                    const current = data.find((person) =>
                        person.name === name
                    )
                    if (current) {
                        setsender(current);
                    }
                    const filtered = data.filter((user) => user.name !== name)
                    setUser(filtered);
                })

        }, 100);

        fetch('http://localhost:8000/products/' + id)
            .then((res) => {
                return res.json();
            })
            .then((product) => {
                setProduct(product)
            })

    }, [])




    const handleShare = (uid, uname) => {
        const { title, body, seller, price, quantity, type } = product;
        const pid = uuidv4();
        const newproduct = { title, body, seller, price, quantity, type, pid, uid }

        fetch('http://localhost:8000/products', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newproduct)
        })
            .then(() => {
                alert("Product has been shared!");
                let notify = `${name} shared a product`;
                const from = { notify, uname };
                socket.emit('notification', from);
            })

    }


    if (sender.id === product.uid) {
        return (
            <div className="title">
                <h1>All Users</h1>

                <p>Click on the User to share the Product: <b>{product.title}</b> </p>

                <div className="productlist">

                    {user.map(u => (
                        <div className="product-preview" key={u.id} >
                            <a id="flex" href="#">
                                <div>
                                    <h2>{u.name}</h2>
                                </div>

                            </a>
                            {u.name !== name && <button onClick={(e) => { handleShare(u.id, u.name) }} style={{ marginLeft: '90%' }} className="sharebtn">Share</button>}
                        </div>
                    ))}

                </div>
            </div>
        );
    }

    else {
        setTimeout(() => {
            const display = document.querySelector('#display');
            display.textContent = "Product not FOUND!";
        }, 1000)

        return (<div id="display" style={{ marginBottom: '70%' }}>
            <LineWave
                height="100"
                width="100"
                color="#4D7298"
                ariaLabel="line-wave"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                firstLineColor=""
                middleLineColor=""
                lastLineColor=""
            />
        </div>);


    }

}

export default Share;
