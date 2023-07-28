import { useState, useEffect, useRef } from 'react';
import { Suspense } from 'react';
import { Await } from '@remix-run/react';
import CardContent from './CardContent';
import Confetti from 'react-dom-confetti';

const ProductTinder = ({products}) => {
  const [TinderCard, setTinderCard] = useState(null);
  const [explode, setExplode] = useState(false); // New state for confetti explosion
  const swipedCards = useRef(new Set()); // Use useRef to store swiped cards
  const buttonRefs = useRef({});
  const debounceTimeouts = useRef({}); // Store timeouts for debouncing

  useEffect(() => {
    import('react-tinder-card').then((module) => setTinderCard(() => module.default));
  }, []);

  const onSwipe = (direction, product) => {
    if (swipedCards.current.has(product.id)) return; // Check if card has already been swiped
    if (direction == 'right') {
      buttonRefs.current[product.id].click();
      setExplode(true); // Trigger confetti explosion
      setTimeout(() => setExplode(false), 1000); // Reset explode state after 1 second
    }
    swipedCards.current.add(product.id); // Add swiped card to the state
  };
  
  const onCardLeftScreen = (myIdentifier) => {
    // Clear previous timeout if exists
    if (debounceTimeouts.current[myIdentifier]) {
      clearTimeout(debounceTimeouts.current[myIdentifier]);
    }

    // Set a new timeout
    debounceTimeouts.current[myIdentifier] = setTimeout(() => {
      console.log(myIdentifier + ' left the screen');
    }, 500); // 500ms delay
  };

  const config = {
    angle: 90,
    spread: 45,
    startVelocity: 45,
    elementCount: 200,
    dragFriction: 0.1,
    duration: 3000,
    stagger: 0,
    width: "10px",
    height: "10px",
    perspective: "500px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={products}>
        {(resolvedProducts) => {
          return (
            <div style={{display: 'flex', justifyContent: 'center', marginTop: '25px'}}>
              {TinderCard && resolvedProducts.products.nodes.map((product) =>
                <TinderCard 
                  key={product.id}
                  onSwipe={(direction) => onSwipe(direction, product)}
                  onCardLeftScreen={() => onCardLeftScreen(product.title)}
                  preventSwipe={['up', 'down']}
                  className={`tinder-card ${swipedCards.current.has(product.id) ? 'hidden' : ''}`} // Apply 'hidden' class if card is swiped
                >
                  <CardContent product={product} buttonRefs={buttonRefs} />
                </TinderCard>
              )}
              <Confetti active={explode} config={config} />
            </div>
          );
        }}
      </Await>
    </Suspense>
  );
};


export default ProductTinder;