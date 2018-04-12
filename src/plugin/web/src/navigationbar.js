/**
 * 动态设置当前页面的标题
 * @param Object
 *          title String 必选 页面标题
 */
export function setNavigationBarTitle ({ title }) {
  if (typeof title === 'string') {
    this.setState({ title });
  }
}
