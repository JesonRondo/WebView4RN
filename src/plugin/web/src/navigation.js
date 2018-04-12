/**
 * 关闭当前页面，返回上一页面
 */
export function navigateBack () {
  this.HPR.Navigation.pop(this.props.pageKey);
}
