import React, { useState, useEffect } from 'react';
import Navigation from "../components/navigation";
import Footer from '../components/footer';

function Blog() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4001/blogs?title=Moong Plant') 
            .then(response => response.json())
            .then(data => setPosts(data))
            .catch(error => console.error('Error fetching blog posts:', error));
    }, []);

    return (
        <div className='blog-container'>
            <Navigation />
            <article className="blog-post">
                {posts.map((post, index) => (
                    <div className="bpost" key={index}>
                        <h2>{index + 1}. {post.title}</h2>
                        <img src={post.image} alt={post.title} />
                        <p>{post.content}</p>
                    </div>
                ))}
            </article>
            <Footer />
        </div>
    );
}

export default Blog;
