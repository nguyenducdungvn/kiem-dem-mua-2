/* =========================================================
   CẤU HÌNH TÁC GIẢ VÀ MÙA – sửa file này để đổi thông tin.
   Để trống trường nào thì phần đó tự ẩn.
   ========================================================= */
window.GAME_CONFIG = {
  version: '2.0.0-alpha.1',          // Phiên bản của cả mùa (tag v2.0.0 khi Tập 1 hoàn chỉnh)
  author: 'Nguyễn Đức Dũng',
  contact: '',
  gameUrl: 'https://kiemdem2.hlvsuckhoe.com/',
  repoUrl: 'https://github.com/nguyenducdungvn/kiem-dem-mua-2',
  season1Url: 'https://kiemdem.hlvsuckhoe.com/',

  feedback: {
    github: true,
    email: '',
    formUrl: ''
  },

  subscribe: {
    issueUrl: '',                    // Tạo Issue "Đăng ký nhận tập mới" rồi dán đường dẫn vào đây
    links: [
      // { label: 'Trang Facebook', url: 'https://facebook.com/...' },
      // { label: 'Nhóm Zalo', url: 'https://zalo.me/g/...' }
    ]
  },

  coffee: {
    message: 'Nếu câu chuyện này làm bạn thức khuya thêm một chút, mời mình một ly cà phê để mình viết tiếp các tập sau nhé.',
    links: [],
    bank: {
      name: 'BIDV · Ngân hàng TMCP Đầu tư và Phát triển Việt Nam',
      number: '3210256468',
      owner: 'NGUYEN DUC DUNG',
      note: 'cafe kiem dem'
    },
    qr: 'images/qr-cafe-bidv.jpg'
  },

  /* ---------- Mùa 2 ---------- */
  season: {
    key: 'kd2',                      // tiền tố khóa lưu trên trình duyệt: kd2_endings, kd2_t1_save…
    characters: ['Thục Anh', 'Bà Tư', 'Anh Sáu', 'Cô Lành', 'Anh Quý', 'Người giữ sổ'],
    episodes: [
      {
        n: 1, name: 'Bãi Bồi', status: 'open',
        blurb: 'Làng Cồn Lở đêm cuối trước khi di dời. Đất đi theo con nước, và cọc mốc cắm ban ngày thì đêm trôi mất.',
        facts: 'Màn 1 · khoảng 15 phút',
        scripts: ['engine/vendor/three.min.js', 'engine/scene3d-kit.js', 'tap-1/story-act1.js', 'tap-1/scene.js']
      },
      { n: 2, name: 'Chợ Sớm', status: 'soon', blurb: 'Chợ cũ của thị trấn sắp thành trung tâm thương mại. Từ 3 giờ sáng, chợ ma dọn hàng và đòi bán cho bạn bằng lời hứa.' },
      { n: 3, name: 'Ca Ba', status: 'soon', blurb: 'Nhà máy dệt cũ chuyển thành khu đô thị. Tiếng máy vẫn chạy ca ba, và sổ giao ca tự viết thêm dòng mới.' },
      { n: 4, name: 'Con Dấu', status: 'soon', blurb: 'Trụ sở xã cũ sau sáp nhập. Con dấu còn hiệu lực đến sáng, và giấy nào được đóng dấu đêm nay sẽ thành sự thật.' }
    ],
    /* Câu tóm tắt hiện khi người chơi nhập Mã hồ sơ Mùa 1 */
    profileFinals: {
      ket4_tron_ven: 'Nhà B4 được bàn giao trọn vẹn, ông Kha được kể câu chuyện cuối cùng.',
      ket4_ky_uc: 'Ký ức nhà B4 được kể lại, dù đêm ấy chưa trọn vẹn.',
      ket4_ho_so_dung: 'Hồ sơ nhà B4 đúng con số, đúng thủ tục, kịp giờ.',
      ket4_nguoi_o_lai: 'Mọi con số ở nhà B4 khớp nhau, nhưng có một người ở lại.'
    },
    profileLines: {
      m1_ghi_su_that: 'Cô đã ghi sự thật về 9,6 m² cơi nới.',
      m1_cong_khai: 'Cô đã để mọi chuyện được công khai trên livestream.',
      m1_ban_ve_dung: 'Cô chọn bản vẽ hoàn công, không giữ bản thiết kế.',
      m1_tra_bong: 'Cô đã trả con búp bê Bông về đúng chỗ.',
      m1_hua_phat: 'Cô đã hứa với anh Phát một điều.',
      m1_tho_ra: 'Út Thơ ra được khỏi căn 509.',
      m1_kha_viet_phieu: 'Ông Kha đã viết phiếu thứ 40.',
      m1_goi_me: 'Cô đã gọi cho mẹ trước ca mổ.',
      m1_nhan_phan_chia: 'Cô đã nhận một phần chia.',
      m1_chia_khoa_giu_lai: 'Có một chiếc chìa khóa B4 không được bàn giao.'
    }
  }
};
