import { CartForm } from "@shopify/hydrogen";
import { Money } from "@shopify/hydrogen";

export default function CardContent({product, buttonRefs}) {
  // Helper function to trim the description
  const trimDescription = (description, characterLimit) => {
    return description.length > characterLimit 
      ? description.substring(0, characterLimit) + "..." 
      : description;
  }
  // Trimmed description
  const trimmedDescription = trimDescription(product.descriptionHtml, 150); // Change 100 to your desired character limit

  return (
    <div className='tinder-content'>
      <div 
        className='tinder-image'
        style={{backgroundImage: `url(${product.images.nodes[0].url})`, backgroundSize: 'contain'}}
        src={product.images.nodes[0].url}
        alt={product.title} 
      />
      <div className="tinder-description">
        <h2>{product.title}</h2>
        <Money className="tinder-price" data={product.priceRange.minVariantPrice} />
        <div dangerouslySetInnerHTML={{__html: trimmedDescription}} />
        <ul className="tinder-tags">
          {product.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>
      <CartForm route="/cart" inputs={{lines: [{merchandiseId: product.variants.nodes[0].id, quantity: 1}]}} action={CartForm.ACTIONS.LinesAdd}>
        {(fetcher) => (
          <div style={{display: 'none'}}>
            <button
              ref={(el) => {
                buttonRefs.current[product.id] = el;
              }}
              type="submit"
            >
            'Add to cart'
            </button>
          </div>
        )}
      </CartForm>
    </div>
  )
}