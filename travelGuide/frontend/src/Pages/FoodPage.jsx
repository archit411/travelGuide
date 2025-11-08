// FoodPage.jsx
import React from "react";
import "./FoodPage.css";

export default function FoodPage() {
  const foods = [
    {
      name: "Italian Delight",
      image:
        "https://images.unsplash.com/photo-1601924638867-3ec3c52a9b30?auto=format&fit=crop&w=900&q=60",
      desc: "Authentic Italian pastas, pizzas, and tiramisu with rich flavors straight from Rome.",
    },
    {
      name: "Street Food Fiesta",
      image:
        "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=900&q=60",
      desc: "Explore the local street foods filled with spice, color, and culture.",
    },
    {
      name: "Coastal Seafood",
      image:
        "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=900&q=60",
      desc: "Enjoy a seaside platter of fresh catches grilled to perfection.",
    },
    {
      name: "Sweet Temptations",
      image:
        "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=900&q=60",
      desc: "Desserts that melt your heart — from cheesecakes to traditional delicacies.",
    },
  ];

  return (
    <div className="food-page">
      <header className="food-header">
        <h1>🍽️ Explore the World Through Food</h1>
        <p>
          From local street bites to global gourmet — dive into cuisines that define
          every culture and destination.
        </p>
      </header>

      <div className="food-grid">
        {foods.map((food, index) => (
          <div className="food-card" key={index}>
            <div className="food-image">
              <img src={food.image} alt={food.name} />
              <div className="food-overlay">
                <button className="explore-btn">Explore More</button>
              </div>
            </div>
            <div className="food-info">
              <h2>{food.name}</h2>
              <p>{food.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
