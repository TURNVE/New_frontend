import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  Calendar, 
  User, 
  Tag,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Filter
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Blog post type definition
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  featured: boolean;
  published: boolean;
  slug: string;
}

// Mock data - replace with API calls
const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'How to Build a Portfolio That Gets You Hired',
    excerpt: 'Learn the key elements that make a portfolio stand out to hiring managers in tech, marketing, and management roles.',
    content: 'Full content here...',
    author: 'Sarah Chen',
    date: '2026-03-15',
    readTime: '8 min',
    category: 'Career Tips',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
    featured: true,
    published: true,
    slug: 'build-portfolio-get-hired'
  },
  {
    id: '2',
    title: 'The AI Coach: How TURNVE Personalizes Your Learning',
    excerpt: 'Deep dive into the technology behind our adaptive learning system and how it helps you improve faster.',
    content: 'Full content here...',
    author: 'Michael A.',
    date: '2026-03-10',
    readTime: '12 min',
    category: 'Product',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
    featured: false,
    published: true,
    slug: 'ai-coach-personalized-learning'
  },
  {
    id: '3',
    title: 'From Bootcamp to Product Manager: A User\'s Journey',
    excerpt: 'Meet Priya, who transitioned from marketing to PM using TURNVE simulations and landed her dream role.',
    content: 'Full content here...',
    author: 'David O.',
    date: '2026-03-05',
    readTime: '6 min',
    category: 'Success Stories',
    image: 'https://images.unsplash.com/photo-1522202176128-8834bd1cb3d8?w=800&q=80',
    featured: false,
    published: true,
    slug: 'bootcamp-to-pm-journey'
  },
  {
    id: '4',
    title: '5 Decision-Making Frameworks Every PM Should Know',
    excerpt: 'Practical frameworks used by top PMs at Meta, Google, and Amazon to make high-stakes decisions.',
    content: 'Full content here...',
    author: 'Priya S.',
    date: '2026-02-28',
    readTime: '10 min',
    category: 'Skills',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    featured: false,
    published: false,
    slug: 'decision-making-frameworks-pm'
  }
];

const categories = ['All', 'Career Tips', 'Success Stories', 'Skills', 'Product', 'Industry', 'Engineering'];

export function AdminBlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>(mockBlogPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const navigate = useNavigate();

  const postsPerPage = 10;

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const handleDelete = (post: BlogPost) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (postToDelete) {
      setPosts(posts.filter(p => p.id !== postToDelete.id));
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const toggleFeatured = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, featured: !post.featured } : post
    ));
  };

  const togglePublished = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, published: !post.published } : post
    ));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#f7f8f8]">Blog Posts</h1>
          <p className="text-[#8a8f98] mt-1">Manage your blog content</p>
        </div>
        <Link to="/admin/blogs/new">
          <Button className="bg-[#5e6ad2] hover:bg-[#828fff] text-white gap-2">
            <Plus className="w-4 h-4" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8f98]" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#111418] border border-[#23252a] rounded-lg text-[#f7f8f8] placeholder-[#5a5f66] focus:outline-none focus:border-[#5e6ad2] transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#8a8f98]" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 bg-[#111418] border border-[#23252a] rounded-lg text-[#f7f8f8] focus:outline-none focus:border-[#5e6ad2] transition-colors cursor-pointer"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#111418] border border-[#23252a] rounded-xl p-4">
          <p className="text-[#8a8f98] text-sm">Total Posts</p>
          <p className="text-2xl font-bold text-[#f7f8f8] mt-1">{posts.length}</p>
        </div>
        <div className="bg-[#111418] border border-[#23252a] rounded-xl p-4">
          <p className="text-[#8a8f98] text-sm">Published</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">
            {posts.filter(p => p.published).length}
          </p>
        </div>
        <div className="bg-[#111418] border border-[#23252a] rounded-xl p-4">
          <p className="text-[#8a8f98] text-sm">Drafts</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">
            {posts.filter(p => !p.published).length}
          </p>
        </div>
        <div className="bg-[#111418] border border-[#23252a] rounded-xl p-4">
          <p className="text-[#8a8f98] text-sm">Featured</p>
          <p className="text-2xl font-bold text-[#7170ff] mt-1">
            {posts.filter(p => p.featured).length}
          </p>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-[#111418] border border-[#23252a] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#23252a]">
                <th className="text-left px-6 py-4 text-sm font-medium text-[#8a8f98]">Post</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-[#8a8f98]">Author</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-[#8a8f98]">Category</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-[#8a8f98]">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-[#8a8f98]">Date</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-[#8a8f98]">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {paginatedPosts.map((post) => (
                  <motion.tr
                    key={post.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-[#23252a] hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-[#f7f8f8] line-clamp-1">{post.title}</p>
                          <p className="text-sm text-[#8a8f98] line-clamp-1">{post.excerpt}</p>
                          {post.featured && (
                            <span className="inline-flex items-center gap-1 mt-1 text-xs text-[#7170ff]">
                              <CheckCircle2 className="w-3 h-3" />
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-[#d0d6e0]">
                        <User className="w-4 h-4 text-[#8a8f98]" />
                        {post.author}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#23252a] text-xs text-[#d0d6e0]">
                        <Tag className="w-3 h-3" />
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePublished(post.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          post.published
                            ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                        }`}
                      >
                        {post.published ? (
                          <><CheckCircle2 className="w-3 h-3" /> Published</>
                        ) : (
                          <><XCircle className="w-3 h-3" /> Draft</>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-[#8a8f98]">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleFeatured(post.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            post.featured
                              ? 'text-[#7170ff] bg-[#5e6ad2]/10'
                              : 'text-[#8a8f98] hover:bg-[rgba(255,255,255,0.04)]'
                          }`}
                          title={post.featured ? 'Remove from featured' : 'Mark as featured'}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <Link
                          to={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-2 text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.04)] rounded-lg transition-colors"
                          title="View post"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/blogs/${post.id}/edit`}
                          className="p-2 text-[#8a8f98] hover:text-[#7170ff] hover:bg-[#5e6ad2]/10 rounded-lg transition-colors"
                          title="Edit post"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post)}
                          className="p-2 text-[#8a8f98] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                          title="Delete post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-[#23252a] rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-[#8a8f98]" />
            </div>
            <h3 className="text-lg font-medium text-[#f7f8f8] mb-2">No posts found</h3>
            <p className="text-[#8a8f98] mb-4">Try adjusting your search or filters</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="border-[#23252a] text-[#d0d6e0]"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#23252a]">
            <p className="text-sm text-[#8a8f98]">
              Showing {((currentPage - 1) * postsPerPage) + 1} to {Math.min(currentPage * postsPerPage, filteredPosts.length)} of {filteredPosts.length} posts
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-[#23252a] text-[#8a8f98] hover:text-[#f7f8f8] hover:border-[#5e6ad2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-[#5e6ad2] text-white'
                      : 'border border-[#23252a] text-[#8a8f98] hover:text-[#f7f8f8] hover:border-[#5e6ad2]'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-[#23252a] text-[#8a8f98] hover:text-[#f7f8f8] hover:border-[#5e6ad2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-[#111418] border-[#23252a] text-[#f7f8f8]">
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription className="text-[#8a8f98]">
              Are you sure you want to delete "{postToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="border-[#23252a] text-[#d0d6e0] hover:bg-[rgba(255,255,255,0.04)]"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminBlogListPage;
