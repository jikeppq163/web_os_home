// 认证服务
export const authService = {
  // 检查是否已登录
  isAuthenticated(): boolean {
    return localStorage.getItem('auth_token') !== null;
  },

  // 获取Token
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  // 验证Token
  async verifyToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      const response = await fetch('http://localhost:5100/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.valid;
      } else {
        // Token无效，清除localStorage中的token
        this.logout();
        return false;
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      // 网络错误也清除token
      this.logout();
      return false;
    }
  },

  // 登出
  logout(): void {
    localStorage.removeItem('auth_token');
  },
};