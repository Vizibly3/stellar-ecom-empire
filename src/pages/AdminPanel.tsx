import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2, Users, Package, ShoppingCart, Settings, Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled";

export default function AdminPanel() {
  const { user, profile, isAdmin, loading } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Product form state
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    image_url: '',
    is_active: true,
    featured: false
  });

  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    slug: '',
    image_url: '',
    is_active: true
  });

  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  useEffect(() => {
    if (isAdmin) {
      fetchAllData();
    }
  }, [isAdmin]);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchUsers(),
        fetchProducts(),
        fetchOrders(),
        fetchCategories()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
    } else {
      setUsers(data || []);
    }
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
    }
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        profiles (full_name, email),
        order_items (*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders(data || []);
    }
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      setCategories(data || []);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('products')
        .insert([{
          ...productForm,
          price: parseFloat(productForm.price),
          stock: parseInt(productForm.stock),
          slug: productForm.title.toLowerCase().replace(/\s+/g, '-')
        }]);

      if (error) {
        toast.error('Failed to create product');
      } else {
        toast.success('Product created successfully');
        setProductForm({
          title: '',
          description: '',
          price: '',
          stock: '',
          category_id: '',
          image_url: '',
          is_active: true,
          featured: false
        });
        fetchProducts();
      }
    } catch (error) {
      toast.error('Failed to create product');
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const { error } = await supabase
        .from('products')
        .update({
          ...productForm,
          price: parseFloat(productForm.price),
          stock: parseInt(productForm.stock),
        })
        .eq('id', editingProduct.id);

      if (error) {
        toast.error('Failed to update product');
      } else {
        toast.success('Product updated successfully');
        setEditingProduct(null);
        fetchProducts();
      }
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        toast.error('Failed to delete product');
      } else {
        toast.success('Product deleted successfully');
        fetchProducts();
      }
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('categories')
        .insert([{
          ...categoryForm,
          slug: categoryForm.slug || categoryForm.name.toLowerCase().replace(/\s+/g, '-')
        }]);

      if (error) {
        toast.error('Failed to create category');
      } else {
        toast.success('Category created successfully');
        setCategoryForm({
          name: '',
          description: '',
          slug: '',
          image_url: '',
          is_active: true
        });
        fetchCategories();
      }
    } catch (error) {
      toast.error('Failed to create category');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) {
        toast.error('Failed to update order status');
      } else {
        toast.success('Order status updated successfully');
        fetchOrders();
      }
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center">
          <Settings className="mr-3" />
          Admin Panel
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{products.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orders.length}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Users Management</CardTitle>
                <CardDescription>Manage all registered users</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{user.full_name || 'No name'}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <p className="text-xs text-gray-400">
                            Role: {user.role} | Joined: {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Products Management
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="btn-primary">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add New Product</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleCreateProduct} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="title">Product Name</Label>
                            <Input
                              id="title"
                              value={productForm.title}
                              onChange={(e) => setProductForm({...productForm, title: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="price">Price</Label>
                            <Input
                              id="price"
                              type="number"
                              step="0.01"
                              value={productForm.price}
                              onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="stock">Stock</Label>
                            <Input
                              id="stock"
                              type="number"
                              value={productForm.stock}
                              onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="category">Category</Label>
                            <Select value={productForm.category_id} onValueChange={(value) => setProductForm({...productForm, category_id: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={productForm.description}
                            onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="image_url">Image URL</Label>
                          <Input
                            id="image_url"
                            value={productForm.image_url}
                            onChange={(e) => setProductForm({...productForm, image_url: e.target.value})}
                          />
                        </div>
                        <Button type="submit" className="btn-primary">Create Product</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        {product.image_url && (
                          <img src={product.image_url} alt={product.title} className="w-16 h-16 object-cover rounded" />
                        )}
                        <div>
                          <p className="font-medium">{product.title}</p>
                          <p className="text-sm text-gray-500">${product.price} | Stock: {product.stock}</p>
                          <p className="text-xs text-gray-400">Category: {product.categories?.name || 'None'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingProduct(product);
                            setProductForm({
                              title: product.title,
                              description: product.description || '',
                              price: product.price.toString(),
                              stock: product.stock.toString(),
                              category_id: product.category_id || '',
                              image_url: product.image_url || '',
                              is_active: product.is_active,
                              featured: product.featured
                            });
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Categories Management
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="btn-primary">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Category</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleCreateCategory} className="space-y-4">
                        <div>
                          <Label htmlFor="name">Category Name</Label>
                          <Input
                            id="name"
                            value={categoryForm.name}
                            onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="slug">Slug</Label>
                          <Input
                            id="slug"
                            value={categoryForm.slug}
                            onChange={(e) => setCategoryForm({...categoryForm, slug: e.target.value})}
                            placeholder="Will be auto-generated if empty"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={categoryForm.description}
                            onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="image_url">Image URL</Label>
                          <Input
                            id="image_url"
                            value={categoryForm.image_url}
                            onChange={(e) => setCategoryForm({...categoryForm, image_url: e.target.value})}
                          />
                        </div>
                        <Button type="submit" className="btn-primary">Create Category</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        {category.image_url && (
                          <img src={category.image_url} alt={category.name} className="w-16 h-16 object-cover rounded" />
                        )}
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-gray-500">{category.description}</p>
                          <p className="text-xs text-gray-400">Slug: {category.slug}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        category.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {category.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Orders Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">Order #{order.order_number}</p>
                          <p className="text-sm text-gray-500">
                            Customer: {order.profiles?.full_name || 'Unknown'} ({order.profiles?.email})
                          </p>
                          <p className="text-sm text-gray-500">
                            Date: {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${order.total_amount}</p>
                          <Select
                            value={order.status}
                            onValueChange={(value: OrderStatus) => handleUpdateOrderStatus(order.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        Items: {order.order_items?.length || 0}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
