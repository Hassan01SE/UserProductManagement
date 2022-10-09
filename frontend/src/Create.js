import { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useHistory } from "react-router-dom";




const Create = () => {

    useEffect(() => {
        document.title = "New Product";
    }, [])

    const [title, setName] = useState("")
    const [seller, setSeller] = useState()
    const [price, setPrice] = useState()
    const [quantity, setQuantity] = useState()
    const [type, setType] = useState("")
    const [body, setText] = useState("")
    const history = useHistory();
    const handleSubmit = (e) => {
        e.preventDefault();

        const product = { title, body, seller, price, quantity, type };

        fetch('http://localhost:8000/products', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product)
        })
            .then(() => {

                console.log("new product added");
                alert("A New Product has been added!");
                setName("");
                setSeller("");
                setType("");
                setText("");
                setPrice(0);
                setQuantity(0);
                history.push('/');

            })


    }


    return (
        <div className="newproduct">
            <h1>Create a New Product</h1>

            <form onSubmit={handleSubmit}>


                <div id='left'>
                    <label>Product Name <br /><br />  <input type="text" name='' required placeholder="Enter Product name here!" value={title}
                        onChange={(e) => {
                            setName(e.target.value);
                        }} /></label>

                    <br />
                    <label>Seller <br /> <br /> <input type="text" name='' required placeholder="Enter Seller name here!" value={seller}
                        onChange={(e) => {
                            setSeller(e.target.value);
                        }} /></label>

                    <br />
                    <label>Price per unit ($) <br /><br /> <input type="number" min={0} required placeholder="Enter Price here!" value={price}
                        onChange={(e) => {
                            setPrice(e.target.value);
                        }} /></label>

                    <br />
                    <label>Quantity <br /> <br /> <input type="number" min={0} required placeholder="Enter Quantity here!" value={quantity}
                        onChange={(e) => {
                            setQuantity(e.target.value);
                        }} /></label>

                    <br />
                    <label>Type (unit) <br /> <br /> <input type="text" required placeholder="Enter Unit here!" value={type}
                        onChange={(e) => {
                            setType(e.target.value);
                        }} /></label>
                    <br /> <br />

                </div>

                <div id="right">
                    <div className="editor">
                        <h5>Description of Product</h5>
                        <CKEditor
                            editor={ClassicEditor}
                            data={body}
                            onChange={(event, editor) => {
                                const data = editor.getData()
                                setText(data);

                            }}
                        />
                    </div>
                    <br />

                </div>
                <br />
                <button id='createbtn' type="submit"><b>Submit Product</b></button>
            </form>



        </div>
    );
}

export default Create;