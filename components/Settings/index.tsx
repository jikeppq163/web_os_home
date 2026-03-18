import React, { useState, useEffect } from 'react';

interface App {
  id: string;
  name: string;
  url: string;
  icon: string;
  color: string;
  isDock: boolean;
  useVPN: boolean;
  requiresPassword: boolean;
}

const Settings: React.FC = () => {
  const [apps, setApps] = useState<App[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newApp, setNewApp] = useState<App>({
    id: '',
    name: '',
    url: '',
    icon: 'globe',
    color: 'from-blue-400 to-blue-600',
    isDock: false,
    useVPN: false,
    requiresPassword: false
  });

  // 加载应用配置
  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await fetch('http://localhost:5100/api/apps');
        if (!response.ok) {
          throw new Error('Failed to fetch apps');
        }
        const data = await response.json();
        setApps(data);
      } catch (err) {
        setError('加载应用配置失败');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApps();
  }, []);

  // 处理应用配置更新
  const handleUpdate = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('http://localhost:5100/api/apps', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apps),
      });

      if (!response.ok) {
        throw new Error('Failed to update apps');
      }

      const data = await response.json();
      setSuccess(data.message || '配置更新成功');
    } catch (err) {
      setError('更新应用配置失败');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // 处理应用字段变更
  const handleAppChange = (index: number, field: keyof App, value: any) => {
    const updatedApps = [...apps];
    updatedApps[index] = {
      ...updatedApps[index],
      [field]: value,
    };
    setApps(updatedApps);
  };

  // 处理新增应用
  const handleAddApp = () => {
    if (!newApp.id || !newApp.name || !newApp.url) {
      setError('请填写应用 ID、名称和 URL');
      return;
    }

    // 检查 ID 是否已存在
    if (apps.some(app => app.id === newApp.id)) {
      setError('应用 ID 已存在');
      return;
    }

    const updatedApps = [...apps, newApp];
    setApps(updatedApps);
    setNewApp({
      id: '',
      name: '',
      url: '',
      icon: 'globe',
      color: 'from-blue-400 to-blue-600',
      isDock: false,
      useVPN: false,
      requiresPassword: false
    });
    setShowAddForm(false);
  };

  // 处理删除应用
  const handleDeleteApp = (index: number) => {
    const appToDelete = apps[index];
    if (appToDelete.id === 'settings') {
      setError('无法删除设置应用');
      return;
    }

    const updatedApps = apps.filter((_, i) => i !== index);
    setApps(updatedApps);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-600">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">应用设置</h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            {showAddForm ? '取消' : '新增应用'}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
            {success}
          </div>
        )}

        {/* 新增应用表单 */}
        {showAddForm && (
          <div className="border border-gray-200 rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold mb-4">新增应用</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">应用 ID</label>
                <input
                  type="text"
                  value={newApp.id}
                  onChange={(e) => setNewApp({...newApp, id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">应用名称</label>
                <input
                  type="text"
                  value={newApp.name}
                  onChange={(e) => setNewApp({...newApp, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">应用 URL</label>
                <input
                  type="text"
                  value={newApp.url}
                  onChange={(e) => setNewApp({...newApp, url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">图标</label>
                <input
                  type="text"
                  value={newApp.icon}
                  onChange={(e) => setNewApp({...newApp, icon: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">颜色</label>
                <input
                  type="text"
                  value={newApp.color}
                  onChange={(e) => setNewApp({...newApp, color: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newApp.isDock}
                  onChange={(e) => setNewApp({...newApp, isDock: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="text-sm font-medium text-gray-700">显示在 Dock 中</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newApp.useVPN}
                  onChange={(e) => setNewApp({...newApp, useVPN: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="text-sm font-medium text-gray-700">使用 VPN</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newApp.requiresPassword}
                  onChange={(e) => setNewApp({...newApp, requiresPassword: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="text-sm font-medium text-gray-700">需要密码</label>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleAddApp}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                确认添加
              </button>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {apps.map((app, index) => (
            <div key={app.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full ${app.color} flex items-center justify-center text-white font-bold`}>
                    {app.icon.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="ml-4 text-xl font-semibold">{app.name}</h2>
                </div>
                {app.id !== 'settings' && (
                  <button
                    onClick={() => handleDeleteApp(index)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    删除
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">应用名称</label>
                  <input
                    type="text"
                    value={app.name}
                    onChange={(e) => handleAppChange(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">应用 URL</label>
                  <input
                    type="text"
                    value={app.url}
                    onChange={(e) => handleAppChange(index, 'url', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">图标</label>
                  <input
                    type="text"
                    value={app.icon}
                    onChange={(e) => handleAppChange(index, 'icon', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">颜色</label>
                  <input
                    type="text"
                    value={app.color}
                    onChange={(e) => handleAppChange(index, 'color', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={app.isDock}
                    onChange={(e) => handleAppChange(index, 'isDock', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">显示在 Dock 中</label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={app.useVPN}
                    onChange={(e) => handleAppChange(index, 'useVPN', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">使用 VPN</label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={app.requiresPassword}
                    onChange={(e) => handleAppChange(index, 'requiresPassword', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">需要密码</label>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleUpdate}
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSaving ? '保存中...' : '保存配置'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;