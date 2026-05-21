import { useParams } from "react-router-dom";


const ProductInfoPage = () => { 
    const { id } = useParams<{ id: string }>();
    return (
        <div>
            <h1>Product Info Page</h1>
            <p>Product ID: {id}</p>
        </div>
    )

}

export default ProductInfoPage