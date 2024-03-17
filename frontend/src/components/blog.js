import React, { useState, useEffect } from 'react';
import Navigation from '../components/navigation';
import Footer from '../components/footer';

function Blog() {
    const [posts, setPosts] = useState(null); // Initialize as null
    const [authors, setAuthors] = useState({}); // Initialize as an empty object
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/blogs/getall', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.success) { // Check if the response is successful
                setPosts(data.data); // Set the blog posts array
            } else {
                throw new Error('Failed to fetch blog posts');
            }
        })
        .catch(err => {
            console.error('Error fetching blog posts:', err);
            setError('Oops! Something went wrong while fetching the blog posts.');
        });
    }, []);

    useEffect(() => {
        if (posts) {
            const uniqueAuthorIds = [...new Set(posts.map(post => post.author))];
            uniqueAuthorIds.forEach(authorId => {
                // Fetch author name only if it hasn't been fetched before
                if (!authors[authorId]) {
                    fetch(`/api/users?userId=${authorId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data && data.success && data.data.length > 0) {
                            setAuthors(prevAuthors => ({
                                ...prevAuthors,
                                [authorId]: data.data[0].name // Update authors state with the author's name
                            }));
                        } else {
                            throw new Error('Failed to fetch author name');
                        }
                    })
                    .catch(err => {
                        console.error('Error fetching author name:', err);
                        setAuthors(prevAuthors => ({
                            ...prevAuthors,
                            [authorId]: 'Unknown Author' // Set a default name if fetching fails
                        }));
                    });
                }
            });
        }
    }, [posts,authors]); // Run the effect whenever posts or authors state changes

    return (
        <div className="blog-container">
            <Navigation />
            <article className="blog-post">
                {error ? (
                    <p>{error}</p>
                ) : posts ? (
                    posts.map(post => (
                        <div className="bpost" key={post._id}>
                            <h2>{post.title}</h2>
                            <p>{post.content}</p>
                            <p>Author: {authors[post.author] || 'Loading...'}</p> {/* Display author name or 'Loading...' */}
                        </div>
                    ))
                ) : (
                    <p>Loading...</p>
                )}
            </article>
            <Footer />
        </div>
    );
}

export default Blog;