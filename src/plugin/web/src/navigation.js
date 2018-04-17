/**
 * 保留当前页面，跳转到应用内的某个页面
 * @param Object
 *          url String 必选 需要跳转的链接
 */
export function navigateTo ({ url }) {
  const { currentUrl } = this.state.currentUrl;
  // 尝试补全 protocol
  if (url.indexOf('//') === 0) {
    if (currentUrl && typeof currentUrl === 'string') {
      const matchs = currentUrl.match(/^(http|https)\:/)
      if (matchs && matchs[0]) {
        const protocol = matchs[0];
        url = protocol + url;
      }
    }
  }

  // 跳转页面
  this.HPR.Navigation.push(url);
}

/**
 * 关闭当前页面，返回上一页面
 */
export function navigateBack () {
  this.HPR.Navigation.pop(this.props.pageKey);
}
