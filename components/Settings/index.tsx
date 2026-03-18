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
        <h1 className="text-2xl font-bold mb-6 text-center">应用设置</h1>

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

        <div className="space-y-6">
          {apps.map((app, index) => (
            <div key={app.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-full ${app.color} flex items-center justify-center text-white font-bold`}>
                  {app.icon.charAt(0).toUpperCase()}
                </div>
                <h2 className="ml-4 text-xl font-semibold">{app.name}</h2>
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