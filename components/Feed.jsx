'use client';

import {useState, useEffect} from 'react';
import PromptCard from './PromptCard';

const PromptCardList= ({data, handleTagClick})=> {
  return(
    <div className='mt-16 prompt_layout'>
      {data.map((post)=>(
        <PromptCard
        key={post._id}
        post={post}
        handleTagClick={handleTagClick}
        />
      ))}
    </div>
  )
}

const Feed = () => {
  const [searchText, setSearchText] = useState('');
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchText(query);
  
    const filtered = posts.filter((post) =>
      post.prompt.toLowerCase().includes(query) ||
     (post.tags && post.tags.toLowerCase().replace(/#/g, "").includes(query))
    );
  
    setFilteredPosts(filtered);
  };
  

  useEffect(()=>{
    const fetchPosts = async()=>{
      const response = await fetch('/api/prompt');
      const data = await response.json();

      setPosts(data);
      setFilteredPosts(data);
    }

    fetchPosts();
  },[]);

  return (
    <section className='feed'>
      <form className='relative w-full flex-center'>
        <input
        type='text'
        placeholder='Search notes'
        value={searchText}
        onChange={handleSearchChange}
        required
        className='search_input peer'
        />
      </form>

      <PromptCardList data={filteredPosts} handleTagClick={() => {}} />
    </section>
  )
}

export default Feed