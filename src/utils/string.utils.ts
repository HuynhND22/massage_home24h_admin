export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD') // convert dấu thành ký tự riêng biệt
    .replace(/[\u0300-\u036f]/g, '') // xóa các ký tự dấu
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '') // chỉ giữ lại chữ thường, số và dấu -
    .replace(/\s+/g, '-') // thay khoảng trắng bằng dấu -
    .replace(/-+/g, '-') // xóa các dấu - liên tiếp
    .replace(/^-+|-+$/g, ''); // xóa dấu - ở đầu và cuối
};
