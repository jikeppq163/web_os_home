import React, { useState, useEffect } from 'react';
import { useApp } from '@/src/AppContext';
import { authService } from '@/src/services/authService';
import ColorPicker from '@/components/ColorPicker';
import { DEFAULT_COLOR } from '@/components/AppIcon';

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
  const { reloadApps } = useApp();
  const [apps, setApps] = useState<App[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedAppIndex, setSelectedAppIndex] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newApp, setNewApp] = useState<App>({
    id: '',
    name: '',
    url: '',
    icon: 'globe',
    color: DEFAULT_COLOR,
    isDock: false,
    useVPN: false,
    requiresPassword: false
  });

  // IP白名单管理
  const [ipWhitelist, setIpWhitelist] = useState<string[]>([]);
  const [isLoadingWhitelist, setIsLoadingWhitelist] = useState(false);
  const [newIp, setNewIp] = useState('');
  const [password, setPassword] = useState('');

  // 加载应用配置
  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await fetch('/api/apps');
        if (!response.ok) {
          throw new Error('Failed to fetch apps');
        }
        const data = await response.json();
        setApps(data);
        // 默认选中第一个非设置应用
        const firstEditableIndex = data.findIndex((app: App) => app.id !== 'settings');
        setSelectedAppIndex(firstEditableIndex >= 0 ? firstEditableIndex : 0);
      } catch (err) {
        setError('加载应用配置失败');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApps();
  }, []);

  // 加载IP白名单
  useEffect(() => {
    const fetchWhitelist = async () => {
      setIsLoadingWhitelist(true);
      try {
        const response = await fetch('/api/auth/whitelist');
        if (!response.ok) {
          throw new Error('Failed to fetch whitelist');
        }
        const data = await response.json();
        setIpWhitelist(data.whitelist);
      } catch (err) {
        setError('加载IP白名单失败');
        console.error(err);
      } finally {
        setIsLoadingWhitelist(false);
      }
    };

    fetchWhitelist();
  }, []);

  // 处理应用配置更新
  const handleUpdate = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/apps', {
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
      // 重新加载应用配置，使首页更新
      await reloadApps();
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

  // 根据应用名称生成唯一 ID
  const generateAppId = (name: string): string => {
    // 移除特殊字符，转换为小写，用下划线连接
    const baseId = name
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '_');
    
    let uniqueId = baseId;
    let counter = 1;
    
    // 确保 ID 唯一
    while (apps.some(app => app.id === uniqueId)) {
      uniqueId = `${baseId}_${counter}`;
      counter++;
    }
    
    return uniqueId;
  };

  // 处理新增应用
  const handleAddApp = () => {
    if (!newApp.name || !newApp.url) {
      setError('请填写应用名称和 URL');
      return;
    }

    // 检查应用名称是否已存在
    if (apps.some(app => app.name === newApp.name)) {
      setError('应用名称已存在');
      return;
    }

    // 自动生成应用 ID
    const generatedId = generateAppId(newApp.name);
    const appToAdd = { ...newApp, id: generatedId };

    const updatedApps = [...apps, appToAdd];
    setApps(updatedApps);
    setNewApp({
      id: '',
      name: '',
      url: '',
      icon: 'globe',
      color: DEFAULT_COLOR,
      isDock: false,
      useVPN: false,
      requiresPassword: false
    });
    setShowAddForm(false);
    // 选中新添加的应用
    setSelectedAppIndex(updatedApps.length - 1);
    setSuccess(`应用 "${appToAdd.name}" 添加成功`);
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
    
    // 调整选中索引
    if (selectedAppIndex === index) {
      setSelectedAppIndex(updatedApps.length > 0 ? 0 : null);
    } else if (selectedAppIndex !== null && selectedAppIndex > index) {
      setSelectedAppIndex(selectedAppIndex - 1);
    }
  };

  // 处理添加IP到白名单
  const handleAddIp = async () => {
    if (!newIp) {
      setError('请输入IP地址');
      return;
    }
    if (!password) {
      setError('请输入密码');
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/auth/whitelist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ip: newIp, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add IP');
      }

      const data = await response.json();
      setSuccess('IP添加成功');
      // 重新加载白名单
      const whitelistResponse = await fetch('/api/auth/whitelist');
      const whitelistData = await whitelistResponse.json();
      setIpWhitelist(whitelistData.whitelist);
      setNewIp('');
      setPassword('');
    } catch (err: any) {
      setError(err.message || '添加IP失败');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // 处理从白名单中删除IP
  const handleDeleteIp = async (ip: string) => {
    if (!password) {
      setError('请输入密码');
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/auth/whitelist/${ip}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete IP');
      }

      const data = await response.json();
      setSuccess('IP删除成功');
      // 重新加载白名单
      const whitelistResponse = await fetch('/api/auth/whitelist');
      const whitelistData = await whitelistResponse.json();
      setIpWhitelist(whitelistData.whitelist);
    } catch (err: any) {
      setError(err.message || '删除IP失败');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-600">加载中...</div>
      </div>
    );
  }

  const selectedApp = selectedAppIndex !== null ? apps[selectedAppIndex] : null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">应用设置</h1>
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              if (showAddForm) setSelectedAppIndex(apps.length > 0 ? 0 : null);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            {showAddForm ? '返回应用列表' : '新增应用'}
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
        {showAddForm ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">新增应用</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">应用名称 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={newApp.name}
                  onChange={(e) => setNewApp({...newApp, name: e.target.value})}
                  placeholder="例如：我的应用"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">应用 URL <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={newApp.url}
                  onChange={(e) => setNewApp({...newApp, url: e.target.value})}
                  placeholder="例如：https://example.com"
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
              <div className="md:col-span-2">
                <ColorPicker
                  value={newApp.color}
                  onChange={(color) => setNewApp({...newApp, color})}
                  label="颜色"
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
        ) : (
          /* 左右分栏布局 */
          <div className="flex gap-6">
            {/* 左侧应用列表 */}
            <div className="w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <h2 className="font-semibold text-gray-700">应用列表</h2>
                  <p className="text-xs text-gray-500 mt-1">共 {apps.length} 个应用</p>
                </div>
                <div className="max-h-[600px] overflow-y-auto">
                  {apps.map((app, index) => (
                    <button
                      key={app.id}
                      onClick={() => setSelectedAppIndex(index)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 text-left
                        transition-colors duration-200
                        hover:bg-gray-50
                        ${selectedAppIndex === index ? 'bg-blue-50 border-l-4 border-blue-500' : 'border-l-4 border-transparent'}
                        ${app.id === 'settings' ? 'opacity-75' : ''}
                      `}
                    >
                      <div className={`w-10 h-10 rounded-lg bg-linear-to-br ${app.color} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                        {app.icon.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{app.name}</div>
                        <div className="text-xs text-gray-500 truncate">{app.id}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 右侧配置区域 */}
            <div className="flex-1">
              {selectedApp ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  {/* 应用头部信息 */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl bg-linear-to-br ${selectedApp.color} flex items-center justify-center text-white font-bold text-2xl`}>
                        {selectedApp.icon.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{selectedApp.name}</h2>
                        <p className="text-sm text-gray-500">ID: {selectedApp.id}</p>
                      </div>
                    </div>
                    {selectedApp.id !== 'settings' && (
                      <button
                        onClick={() => handleDeleteApp(selectedAppIndex)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        删除应用
                      </button>
                    )}
                  </div>

                  {/* 配置表单 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">应用名称</label>
                      <input
                        type="text"
                        value={selectedApp.name}
                        onChange={(e) => handleAppChange(selectedAppIndex, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">应用 URL</label>
                      <input
                        type="text"
                        value={selectedApp.url}
                        onChange={(e) => handleAppChange(selectedAppIndex, 'url', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">图标</label>
                      <input
                        type="text"
                        value={selectedApp.icon}
                        onChange={(e) => handleAppChange(selectedAppIndex, 'icon', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <ColorPicker
                        value={selectedApp.color}
                        onChange={(color) => handleAppChange(selectedAppIndex, 'color', color)}
                        label="颜色"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-3">选项</label>
                      <div className="flex flex-wrap gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedApp.isDock}
                            onChange={(e) => handleAppChange(selectedAppIndex, 'isDock', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">显示在 Dock 中</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedApp.useVPN}
                            onChange={(e) => handleAppChange(selectedAppIndex, 'useVPN', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">使用 VPN</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedApp.requiresPassword}
                            onChange={(e) => handleAppChange(selectedAppIndex, 'requiresPassword', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">需要密码</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* 保存按钮 */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={handleUpdate}
                      disabled={isSaving}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isSaving ? '保存中...' : '保存配置'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <div className="text-gray-400 text-lg">请选择一个应用进行配置</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* IP白名单管理 */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">IP白名单管理</h1>

          {/* 添加IP表单 */}
          <div className="border border-gray-200 rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold mb-4">添加IP到白名单</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">IP地址</label>
                <input
                  type="text"
                  value={newIp}
                  onChange={(e) => setNewIp(e.target.value)}
                  placeholder="例如: 192.168.1.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="输入管理密码"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end space-x-2">
                <button
                  onClick={handleAddIp}
                  disabled={isSaving}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed w-full"
                >
                  {isSaving ? '添加中...' : '添加IP'}
                </button>
                <button
                  onClick={() => setNewIp('192.168.*.*')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full"
                >
                  添加局域网
                </button>
              </div>
            </div>
          </div>

          {/* IP白名单列表 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">已授权的IP地址</h2>
            {isLoadingWhitelist ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-xl font-semibold text-gray-600">加载中...</div>
              </div>
            ) : ipWhitelist.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                暂无授权IP
              </div>
            ) : (
              <div className="space-y-2">
                {ipWhitelist.map((ip) => (
                  <div key={ip} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="font-medium">{ip}</div>
                    <button
                      onClick={() => handleDeleteIp(ip)}
                      disabled={isSaving}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      删除
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
