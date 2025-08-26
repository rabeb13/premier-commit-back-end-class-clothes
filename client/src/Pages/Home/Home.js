import React from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import CardCategory from '../../Components/CardCategory/CardCategory';
import Suggestions from '../../Components/Suggestions/Suggestions';
import Footer from '../../Components/Footer';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './Home.css';

const suggestionsData = [
  { id: 1, name: 'Ceinture à maillons', price: '12,99', image: 'https://plus.unsplash.com/premium_photo-1681276168324-a6f1958aa191?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YnJhY2VsZXR8ZW58MHx8MHx8fDA%3D' },
  { id: 2, name: 'Ceinture à rivets', price: '17,99', image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YnJhY2VsZXR8ZW58MHx8MHx8fDA%3D' },
  { id: 4, name: 'Ceinture chaîne étoiles de mer', price: '12,99', image: 'https://images.unsplash.com/photo-1705326454933-9685fc6888e1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGJvdWNsZSUyMGRvcmVpbGxlfGVufDB8fDB8fHww' },
  { id: 5, name: 'Ceinture chaîne spirales', price: '12,99', image: 'https://images.unsplash.com/photo-1610213665246-eb2df074f8e6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGJvdWNsZSUyMGRvcmVpbGxlfGVufDB8fDB8fHww' },
];

const categories = [
  { title: 'T-Shirts', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', link: '/tshirts' },
  { title: 'Jeans', image: 'https://plus.unsplash.com/premium_photo-1674828601362-afb73c907ebe?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8amVhbnN8ZW58MHx8MHx8fDA%3D', link: '/jeans' },
  { title: 'Dresses', image: 'https://plus.unsplash.com/premium_photo-1674718918254-8f96b77c12d8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZHJlc3Nlc3xlbnwwfHwwfHx8MA%3D%3D', link: '/dresses' },
  { title: 'Shoes', image: 'https://plus.unsplash.com/premium_photo-1676234844384-82e1830af724?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGFsb25zJTIwaGF1dHN8ZW58MHx8MHx8fDA%3D', link: '/shoes' },
  { title: 'Bags', image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGJhZ3N8ZW58MHx8MHx8fDA%3D', link: '/bags' },
];

const newArrivals = [
  { id: 1, name: "Robe", price: 59.99, image: "https://plus.unsplash.com/premium_photo-1708276242787-387acf1bbd4b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cm9iZSUyMHRyZW5kfGVufDB8fDB8fHww"},
  { id: 2, name: "Talon", price: 89.99, image: "https://plus.unsplash.com/premium_photo-1668698471580-02f5c8eb739a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHRhbG9ufGVufDB8fDB8fHww" },
  { id: 3, name: "Bonnet", price: 49.99, image: "https://images.unsplash.com/photo-1676790408057-b56c464beb0f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGNhc3F1ZXR0ZSUyMHRyZW5kfGVufDB8fDB8fHww" },
  { id: 4, name: "Veste", price: 39.99, image: "https://plus.unsplash.com/premium_photo-1675186049366-64a655f8f537?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dmVzdGV8ZW58MHx8MHx8fDA%3D" },
];

const Home = () => {
  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,  
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 }},
      { breakpoint: 768, settings: { slidesToShow: 1 }},
    ]
  };

  return (
    <div className="home-container">

      {/* Slider catégories */}
      <Slider {...settings} className="slider-categories">
        {categories.map(cat => (
          <CardCategory
            key={cat.title}
            title={cat.title}
            image={cat.image}
            link={cat.link}
          />
        ))}
      </Slider>

      {/* Nouveautés */}
      <section className="new-arrivals">
        <h2>NEW ARRIVALS</h2>
        <div className="products-grid">
          {newArrivals.map(p => {
            let link = "";
            switch(p.id) {
              case 1: link = "/dresses"; break;
              case 2: link = "/shoes"; break;
              case 3: link = "/jeans"; break;
              case 4: link = "/blouses"; break;
              default: link = "/"; 
            }
            return (
              <div 
                key={p.id} 
                className="product-card"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(link)}
              >
                <img src={p.image} alt={p.name} />
                <p>{p.name}</p>
                <span>{p.price} TND</span>
              </div>
            );
          })}
        </div>
        {/* <button className="view-all-btn" onClick={() => navigate('/new-arrivals')}>
          VIEW ALL
        </button> */}
      </section>
{/* Promotions */}
<section 
  className="promotions-section" 
  onClick={() => navigate('/accessories')}
>
  <img src="https://plus.unsplash.com/premium_photo-1674718917175-70e7062732e5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dmVzdGUlMjBkb3Vkb3VuZXxlbnwwfHwwfHx8MA%3D%3D" 
       alt="Sale Banner" />
  <div className="promo-text">
    <h2>UP TO 50% OFF</h2>
    <p>WOMEN'S CLOTHING</p>
  </div>
</section>


{/* Suggestions */}
<section 
  className="suggestions-section"
  onClick={() => navigate('/accessories')}
>
  <h2>Suggestions</h2>
  <div className="suggestions-grid">
    {suggestionsData.map(p => (
      <div key={p.id} className="product-card">
        <img src={p.image} alt={p.name} />
        <p>{p.name}</p>
        <span>{p.price} TND</span>
      </div>
    ))}
  </div>
</section>



      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
};

export default Home;
