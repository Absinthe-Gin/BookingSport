# Website Inventory: datlich.alobo.vn

Survey date: 2026-11-18. Source: `https://datlich.alobo.vn/` (ALO Booking, Flutter Web app, CanvasKit renderer).
The owner of this repository says they have permission from Alobo to copy the branding, images and data.

## Technical notes

- The source is a **Flutter Web** app. It draws everything on a canvas, so the page has no normal DOM, links or CSS.
  To read text we turned on Flutter's accessibility layer (`flt-semantics-placeholder`). For layout we used screenshots.
- Data comes from `https://user-api-new.alobo.vn/api/v1/public/...`. Every request needs a time-based signature header.
  We did **not** try to get around the signature. Venue data was taken from the text shown on screen instead.
- Images come from `m-files.alobo.vn` (venue covers and avatars) and `datlich.alobo.vn/assets/assets/...` (icons, header image, onboarding).
- Fonts (from `assets/FontManifest.json`): **Averta** (main UI font, a paid commercial font), Roboto, Mulish.
  Averta's licence belongs to Alobo and does not come with the permission to copy content, so the clone uses **Mulish** (free, OFL) instead.
- The map uses Google Maps JS. The clone uses Leaflet with OpenStreetMap tiles.
- Headless browsers get the onboarding screen and then the error "Không có kết nối internet", because the API refuses them.
  That gave us reference shots of the loading and error states.

## Routes

| Source route | Page | Type | Layout | Status in clone |
|---|---|---|---|---|
| `/` (first visit) | Onboarding, 4 slides ("Bỏ Qua", "Tiếp tục") | Intro | Full screen | Done |
| `/` | Trang chủ: list of venues near you | List | App shell + bottom nav | Done |
| `/` + side panel | Venue detail (left panel, 592px wide, 6 tabs) | Detail | Panel over the list | Done (`/san/:slug`) |
| (after confirm) | Payment / booking result | Function | Full screen | Done (`/booking/:code`), simulated payment |
| `/san/:slug` | Online booking link for a venue | Detail | Same as above | Done |
| `/userBooking` | "Đặt lịch theo sân - trực quan": courts × time grid | Function | Full screen, own header | Done (`/userBooking/:slug`) |
| `/userBooking` (sub-page) | "Xem sân và bảng giá": price table | Detail | Full screen | Done |
| `/userBooking` (step 2) | Confirm and pay: venue info, booking info, form | Form | Full screen | Done |
| (search screen) | "Tìm kiếm": search box + list + filter side panel | List + filters | Full screen | Done (`/search`) |
| `/socialNearby` | "Social gần đây": filters + sessions by venue | List + filters | Full screen | Done |
| (bottom nav) Bản đồ | Map with sport filter chips and venue markers | Map | App shell | Done (`/map`) |
| (bottom nav) Khám phá | Feed with 7 tabs: Social, Sự kiện, Gói hội viên, Khóa học, Thông báo, Ưu đãi, Pass sân | Feed | App shell | Done (`/explore`) |
| (bottom nav) Nổi bật | Grid of promo banners, each with a CTA | List | App shell | Done (`/featured`) |
| (bottom nav) Tài khoản | Profile menu on the left, booking list on the right | Account | App shell | Done (`/account`) |
| `/uLogin` | Đăng nhập (phone or email tab, password, Google) | Form | Green background | Done |
| (from login) | Đăng ký (phone, email, name, password, confirm) | Form | Green background | Done (`/uRegister`) |
| Toolbar "Sân đã đặt" | Booked courts | List | Same as account | Done (`/account`) |
| Toolbar "Yêu thích" | Favourites (shows toast "Chưa có sân yêu thích" when empty) | List | App shell | Done (`/favorites`) |
| "Chat với sân" / chat icon | Chat | Needs login | n/a | Not built: we could not see it without an account |
| "Mua vé Social" | Buying social tickets | Function | n/a | Partly built: joining a session in Social |

## Shared layout (desktop ≥ 1024px)

- **Header** (108px tall): `home_header.png` background with a green tint. Logo (64px circle), date "Thứ tư, 18/11/2026",
  buttons "Đăng nhập" (white, 240×32) and "Đăng kí" (outlined). Chat and language icons on the right.
- **Toolbar** (48px, white, radius 8, shadow, 8px side margin, sits over the header): logo, search box, locate icon, filter icon,
  divider, "Social gần đây" pill (dark green), then "Bản đồ", "Sân đã đặt", "Yêu thích".
- **Venue grid**: 3 columns, gap about 14px, cards 454×200. Cover image 116px high. Overlay chips: rating, "Đơn ngày" (green), "Sự kiện" (pink).
  Heart and share buttons are 36px white circles. Below the image: avatar (56px circle), name (bold 15px), distance (orange) and address, opening hours, yellow "ĐẶT LỊCH" button.
- **Bottom nav** (80px, white, rounded top, green shadow): Trang chủ, Bản đồ, Khám phá (raised 64px circle in the middle), Nổi bật, Tài khoản. The active item is green.

## Mobile/tablet (< 1024px)

- The header hides the long toolbar. You get a search field, a locate button and a heart button (white cards, radius 8),
  with a dark-green "Social gần đây" button below. Login and register buttons show on tablet but are hidden on phones.
- The venue list becomes 1 column on phones and 2 columns on tablets.

## Design tokens (sampled from screenshots)

| Token | Value |
|---|---|
| primary | `#006D38` (header bar, buttons) |
| primary-dark | `#00592D` |
| primary-light | `#E9F8EF` (page background on booking and side panel) |
| accent-yellow | `#E2B033` ("ĐẶT LỊCH", "TIẾP THEO") |
| success-chip | `#1DB45A` ("Đơn ngày") |
| event-pink | `#E88AE8` ("Sự kiện") |
| distance | `#E8590C` |
| booked | `#FF6666`, past `#B04848`, locked `#A3A3A3`, event `#C98ADB` |
| grid-header | `#B8ECFF` |
| text | `#0F2B1D`, muted `#5B6B62` |
| bg | `#F5F5F5` |
| radius | 6 / 8 / 12 / 999 |

## Interactions found

| Trigger | Result |
|---|---|
| Card / "ĐẶT LỊCH" | Modal "CHỌN HÌNH THỨC ĐẶT" with 2 choices: "Đặt lịch theo sân - trực quan" (green) and "Mua vé social" (pink, with a "New" badge) |
| Click a card | Detail panel slides in from the left. Tabs: Thông tin, Gói hội viên, Dịch vụ (price table), Hình ảnh, Điều khoản & quy định, Đánh giá |
| Grid: click a free cell | Cell turns light green with a dark border. A bottom sheet shows "Tổng giờ", "Tổng tiền" and "TIẾP THEO" |
| Grid: date chip | Changes the day (14 days ahead, month dropdown) |
| Grid: zoom slider | Changes the cell width |
| "TIẾP THEO" | Confirm page. Guests see "Đăng nhập để có thể sử dụng ưu đãi". Form: name, phone (+84), note, student card upload. Button "XÁC NHẬN & THANH TOÁN" |
| "Xem sân & bảng giá" | Price table: time ranges × "Cố định" / "Vãng lai" |
| Filter icon | Search screen with a right panel: sport chips, booking type, area (province/ward) or distance, keyword chips, "Tìm kiếm" |
| "Yêu thích" when empty | Toast "Thông báo / Chưa có sân yêu thích" |
| "Tài khoản" as a guest | Dialog "Tạo tài khoản để dễ dàng quản lý và lưu trữ lịch đặt của bạn." with OK |
| Explore: Social | Filters on the left (radius, sport, level, time of day, price, sort). Day picker. Venue cards with time chips and session tickets ("LIVE", "Xé vé", spots taken, price per ticket, "Đặt chỗ") |
| Network error | Red toast at top right, plus an orange "Thông báo" dialog |

## Data collected

- 15 venues near Hà Nội centre: name, address, distance, opening hours, rating, cover and avatar images (`src/data` + `server/seed`).
- Price table for "Pickleball cổng B Ga Hà Nội" (4 time ranges). Other venues use the same table pattern with **estimated** prices (marked `estimated` in the seed).
- Social sessions for 4 venues on 18/11 (times, spots, price, level). Other dates are **simulated** with a fixed seed.
- Explore feed posts: ECO PICK, TM PICKLEBALL TƯƠNG MAI, NET Sports, Pickleball Tòa Nhà CT2 (events, packages, courses, free-court notices).
- Promo banners (6), cropped from reference screenshots because the original files were cached and not captured. "Gold Pickleball Q3" and "WinX" lose the top part.
- Venue coordinates are **estimated** from the address and the shown distance. The source API would not give them to us.

## Not surveyed

- Logged-in screens (profile edit, real booking history, chat). We did not create an account.
- The payment step after "XÁC NHẬN & THANH TOÁN". We did not submit, to avoid making a real booking.
  The clone shows a simulated VietQR transfer screen.
- "Mua vé Social" checkout.
