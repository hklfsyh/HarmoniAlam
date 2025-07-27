import React, { useState } from 'react';
import ArticleHeader from '../components/ArticleComponents/ArticleHeader';
import ArticleFilter from '../components/ArticleComponents/ArticleFilter';
import ArticleList from '../components/ArticleComponents/ArticleList';

const ArticlesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-6 py-12 mt-16">
        <ArticleHeader />
        <ArticleFilter 
          setSearchTerm={setSearchTerm}
          setSelectedCategory={setSelectedCategory}
        />
        <ArticleList 
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
        />
      </main>
    </div>
  );
};

export default ArticlesPage;
