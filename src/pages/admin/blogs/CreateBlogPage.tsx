import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Image as ImageIcon, 
  Calendar,
  User,
  Tag,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const categories = ['Career Tips', 'Success Stories', 'Skills', 'Product', 'Industry', 'Engineering'];

export function CreateBlogPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: 'Career Tips',
    image: '',
    readTime: '5 min',
    featured: false,
    published: false,
  });

  const handleSubmit = async (e: React.FormEvent, publish = false) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate slug from title
    const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    console.log('Creating blog post:', { ...formData, slug, published: publish });
    
    setIsSubmitting(false);
    setSaveSuccess(true);
    
    setTimeout(() => {
      navigate('/admin/blogs');
    }, 1500);
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/blogs"
            className="p-2 rounded-lg border border-[#23252a] text-[#8a8f98] hover:text-[#f7f8f8] hover:border-[#5e6ad2] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#f7f8f8]">Create New Post</h1>
            <p className="text-[#8a8f98] mt-1">Write and publish a new blog post</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="border-[#23252a] text-[#d0d6e0] hover:bg-[rgba(255,255,255,0.04)] gap-2"
          >
            <Eye className="w-4 h-4" />
            {showPreview ? 'Edit' : 'Preview'}
          </Button>
          <Button
            variant="outline"
            onClick={(e) => handleSubmit(e, false)}
            disabled={isSubmitting}
            className="border-[#23252a] text-[#d0d6e0] hover:bg-[rgba(255,255,255,0.04)] gap-2"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </Button>
          <Button
            onClick={(e) => handleSubmit(e, true)}
            disabled={isSubmitting || !formData.title || !formData.content}
            className="bg-[#5e6ad2] hover:bg-[#828fff] text-white gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Publish
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3 text-emerald-400"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>Post created successfully! Redirecting...</span>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {!showPreview ? (
            <>
              {/* Title */}
              <div className="bg-[#111418] border border-[#23252a] rounded-xl p-6">
                <label className="block text-sm font-medium text-[#8a8f98] mb-2">
                  Post Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter an engaging title..."
                  className="w-full px-4 py-3 bg-[#0d0f11] border border-[#23252a] rounded-lg text-[#f7f8f8] placeholder-[#5a5f66] focus:outline-none focus:border-[#5e6ad2] transition-colors text-lg font-medium"
                />
                {formData.title && (
                  <p className="mt-2 text-xs text-[#5a5f66]">
                    URL Slug: /blog/{generateSlug(formData.title)}
                  </p>
                )}
              </div>

              {/* Excerpt */}
              <div className="bg-[#111418] border border-[#23252a] rounded-xl p-6">
                <label className="block text-sm font-medium text-[#8a8f98] mb-2">
                  Excerpt *
                </label>
                <p className="text-xs text-[#5a5f66] mb-2">
                  Brief summary that appears in blog listings (max 200 characters)
                </p>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Write a compelling summary..."
                  rows={3}
                  maxLength={200}
                  className="w-full px-4 py-3 bg-[#0d0f11] border border-[#23252a] rounded-lg text-[#f7f8f8] placeholder-[#5a5f66] focus:outline-none focus:border-[#5e6ad2] transition-colors resize-none"
                />
                <p className="mt-1 text-xs text-[#5a5f66] text-right">
                  {formData.excerpt.length}/200
                </p>
              </div>

              {/* Content */}
              <div className="bg-[#111418] border border-[#23252a] rounded-xl p-6">
                <label className="block text-sm font-medium text-[#8a8f98] mb-2">
                  Content *
                </label>
                <p className="text-xs text-[#5a5f66] mb-2">
                  Write your blog post content. Supports Markdown formatting.
                </p>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="# Start writing your post...\n\nUse Markdown for formatting:\n\n## Subheadings\n\n- Bullet points\n- Lists\n\n**Bold text** and *italic text*\n\n[Links](url)\n\n![Images](url)"
                  rows={20}
                  className="w-full px-4 py-3 bg-[#0d0f11] border border-[#23252a] rounded-lg text-[#f7f8f8] placeholder-[#5a5f66] focus:outline-none focus:border-[#5e6ad2] transition-colors resize-none font-mono text-sm"
                />
              </div>
            </>
          ) : (
            /* Preview Mode */
            <div className="bg-[#111418] border border-[#23252a] rounded-xl p-8">
              <div className="prose prose-invert max-w-none">
                {formData.image && (
                  <img
                    src={formData.image}
                    alt={formData.title}
                    className="w-full h-64 object-cover rounded-xl mb-6"
                  />
                )}
                <h1 className="text-3xl font-bold text-[#f7f8f8] mb-4">
                  {formData.title || 'Untitled Post'}
                </h1>
                <div className="flex items-center gap-4 text-sm text-[#8a8f98] mb-6">
                  {formData.author && (
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {formData.author}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date().toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formData.readTime}
                  </span>
                </div>
                <p className="text-lg text-[#d0d6e0] mb-6 font-medium">
                  {formData.excerpt}
                </p>
                <div className="text-[#d0d6e0] whitespace-pre-wrap">
                  {formData.content || 'No content yet...'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <div className="bg-[#111418] border border-[#23252a] rounded-xl p-6">
            <h3 className="text-sm font-medium text-[#f7f8f8] mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#7170ff]" />
              Publish Settings
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#d0d6e0]">Featured Post</p>
                  <p className="text-xs text-[#8a8f98]">Show on homepage</p>
                </div>
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#d0d6e0]">Publish Immediately</p>
                  <p className="text-xs text-[#8a8f98]">Make post public</p>
                </div>
                <Switch
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                />
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-[#111418] border border-[#23252a] rounded-xl p-6">
            <h3 className="text-sm font-medium text-[#f7f8f8] mb-4 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#7170ff]" />
              Featured Image
            </h3>
            
            {formData.image ? (
              <div className="relative">
                <img
                  src={formData.image}
                  alt="Featured"
                  className="w-full h-40 object-cover rounded-lg"
                />
                <button
                  onClick={() => setFormData({ ...formData, image: '' })}
                  className="absolute top-2 right-2 p-1.5 bg-red-500/80 text-white rounded-lg hover:bg-red-500 transition-colors"
                >
                  <AlertCircle className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-[#23252a] rounded-lg p-6 text-center">
                <ImageIcon className="w-8 h-8 text-[#5a5f66] mx-auto mb-2" />
                <p className="text-sm text-[#8a8f98] mb-2">Enter image URL below</p>
              </div>
            )}
            
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full mt-3 px-3 py-2 bg-[#0d0f11] border border-[#23252a] rounded-lg text-[#f7f8f8] placeholder-[#5a5f66] focus:outline-none focus:border-[#5e6ad2] transition-colors text-sm"
            />
          </div>

          {/* Post Details */}
          <div className="bg-[#111418] border border-[#23252a] rounded-xl p-6">
            <h3 className="text-sm font-medium text-[#f7f8f8] mb-4 flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#7170ff]" />
              Post Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[#8a8f98] mb-1.5">Author *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a5f66]" />
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Author name"
                    className="w-full pl-10 pr-3 py-2 bg-[#0d0f11] border border-[#23252a] rounded-lg text-[#f7f8f8] placeholder-[#5a5f66] focus:outline-none focus:border-[#5e6ad2] transition-colors text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs text-[#8a8f98] mb-1.5">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0d0f11] border border-[#23252a] rounded-lg text-[#f7f8f8] focus:outline-none focus:border-[#5e6ad2] transition-colors text-sm cursor-pointer"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs text-[#8a8f98] mb-1.5">Read Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a5f66]" />
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    placeholder="e.g., 5 min"
                    className="w-full pl-10 pr-3 py-2 bg-[#0d0f11] border border-[#23252a] rounded-lg text-[#f7f8f8] placeholder-[#5a5f66] focus:outline-none focus:border-[#5e6ad2] transition-colors text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-[#5e6ad2]/10 border border-[#5e6ad2]/20 rounded-xl p-4">
            <h4 className="text-sm font-medium text-[#7170ff] mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Writing Tips
            </h4>
            <ul className="text-xs text-[#8a8f98] space-y-1.5 list-disc list-inside">
              <li>Use clear, engaging headlines</li>
              <li>Break content into sections</li>
              <li>Include relevant examples</li>
              <li>Add a call-to-action at the end</li>
              <li>Optimize images for web</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateBlogPage;
