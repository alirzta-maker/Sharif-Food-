import { useContext } from 'react';
import { AppContext } from './App';
import { Translations, Language } from './types';

export const translations: Translations = {
  // General
  sharif_food: { en: 'Sharif Food', fa: 'شریف فود' },
  login: { en: 'Login', fa: 'ورود' },
  register: { en: 'Register', fa: 'ثبت نام' },
  sign_up: { en: 'Sign Up', fa: 'ثبت نام' },
  login_here: { en: 'Already have an account? Login here.', fa: 'حساب کاربری دارید؟ از اینجا وارد شوید.' },
  register_here: { en: 'Don\'t have an account? Register here.', fa: 'حساب کاربری ندارید؟ از اینجا ثبت نام کنید.' },
  full_name: { en: 'Full Name', fa: 'نام و نام خانوادگی' },
  student_id: { en: 'Student ID', fa: 'کد دانشجویی' },
  email_phone: { en: 'Email or Phone', fa: 'ایمیل یا شماره تلفن' },
  password: { en: 'Password', fa: 'رمز عبور' },
  total: { en: 'Total', fa: 'مجموع' },
  
  // Roles
  sharif_gir: { en: 'SharifGir', fa: 'شریف‌گیر' },
  sharif_bar: { en: 'SharifBar', fa: 'شریف‌بر' },
  order_food_prompt: { en: 'Order food from Sharif campus restaurants', fa: 'از رستوران‌های دانشگاه شریف غذا سفارش دهید' },
  deliver_meals_prompt: { en: 'Deliver orders across campus', fa: 'سفارش‌ها را در سطح دانشگاه تحویل دهید' },
  select_your_role: { en: 'Select Your Role', fa: 'نقش خود را انتخاب کنید' },

  // Gir App
  home: { en: 'Home', fa: 'خانه' },
  cart: { en: 'Cart', fa: 'سبد خرید' },
  account: { en: 'Account', fa: 'حساب' },
  your_profile: { en: 'پروفایل شما', fa: 'پروفایل شما' },
  search_placeholder: { en: 'Search for any food item...', fa: 'هر نوع غذایی را جستجو کنید...' },
  filters: { en: 'Filters', fa: 'فیلترها' },
  price_low_high: { en: 'Cheapest', fa: 'ارزان‌ترین' },
  price_high_low: { en: 'Most Expensive', fa: 'گران‌ترین' },
  most_popular: { en: 'Most Popular', fa: 'محبوب‌ترین' },
  all: { en: 'All', fa: 'همه' },
  back: { en: 'Back', fa: 'بازگشت' },
  food_party: { en: 'Food Party!', fa: 'فود پارتی!' },
  featured_restaurants: { en: 'Featured Restaurants', fa: 'رستوران‌های منتخب' },
  menu_items: { en: 'All Food Items', fa: 'تمام آیتم‌های غذایی' },
  self_service_selection_needed: { en: 'Please select a food item and a dining hall.', fa: 'لطفاً یک غذای اصلی و سالن غذاخوری را انتخاب کنید.' },
  toggle_filters: {en: 'Toggle Filters', fa: 'نمایش/مخفی فیلترها'},
  categories: {en: 'Categories', fa: 'دسته‌بندی‌ها'},

  // Categories
  iranian: { en: 'Iranian', fa: 'ایرانی' },
  fast_food: { en: 'Fast Food', fa: 'فست فود' },
  pizza: { en: 'Pizza', fa: 'پیتزا' },
  cafe: { en: 'Cafe', fa: 'کافه' },
  drinks: { en: 'Drinks', fa: 'نوشیدنی' },
  sandwich: { en: 'Sandwich', fa: 'ساندویچ' },
  salad: { en: 'Salad', fa: 'سالاد' },
  breakfast: { en: 'Breakfast', fa: 'صبحانه' },
  snacks: { en: 'Snacks', fa: 'اسنک' },
  healthy: { en: 'Healthy', fa: 'سلامت' },
  add_ons: { en: 'Add-ons', fa: 'افزودنی‌ها' },
  pasta: { en: 'Pasta', fa: 'پاستا' },
  burgers: { en: 'Burgers', fa: 'برگرها' },
  appetizers: { en: 'Appetizers', fa: 'پیش غذا' },
  fast_food_snack: { en: 'Fast Food / Snack', fa: 'فست فود / اسنک' },

  // External Restaurants
  order_online: { en: 'Order Online', fa: 'سفارش آنلاین' },
  submit_delivery_request: { en: 'Submit Delivery Request', fa: 'ثبت درخواست پیک' },
  request_delivery_desc: { en: 'Order on their site, then request a rider here.', fa: 'در سایت آن‌ها سفارش دهید، سپس از اینجا درخواست پیک کنید.'},
  food_name: { en: 'Food Name', fa: 'نام غذا' },
  price: { en: 'Price (Toman)', fa: 'قیمت (تومان)' },
  pickup_point: { en: 'Pickup Point', fa: 'محل تحویل گرفتن' },
  delivery_location: { en: 'Delivery Location', fa: 'محل تحویل دادن' },
  order_notes_placeholder: { en: 'e.g., Deliver to the entrance, call when you arrive...', fa: 'مثال: به ورودی تحویل دهید، هنگام رسیدن تماس بگیرید...' },
  customer_phone_placeholder: { en: 'Your Phone Number', fa: 'شماره تلفن شما' },
  promo_code: { en: 'Promo Code', fa: 'کد تخفیف' },
  apply_promo: { en: 'Apply', fa: 'اعمال' },
  promo_code_applied: { en: 'Promo code applied!', fa: 'کد تخفیف اعمال شد!' },
  discount_amount: { en: 'Discount', fa: 'تخفیف' },
  select_delivery_location: { en: 'Select Delivery Location', fa: 'انتخاب محل تحویل' },


  // Self Service
  food_item: { en: 'Food Item', fa: 'غذای اصلی' },
  dining_hall: { en: 'Dining Hall', fa: 'سالن غذاخوری' },
  checkout: { en: 'Checkout', fa: 'پرداخت' },
  order_code: { en: 'Your Order Code', fa: 'کد سفارش شما' },

  // Bar App
  order_dashboard: { en: 'Available Requests', fa: 'درخواست‌های موجود' },
  earning_summary: { en: 'Earning Summary', fa: 'خلاصه درآمد' },
  active_deliveries: { en: 'Active Deliveries', fa: 'تحویل‌های فعال' }, 
  accept_order: { en: 'Accept', fa: 'قبول' },
  decline_order: { en: 'Decline', fa: 'رد' },
  start_delivery: { en: 'Start Delivery', fa: 'شروع تحویل' },
  earnings: { en: 'Earnings', fa: 'درآمد' },
  items: { en: 'Items', fa: 'اقلام' },
  from: { en: 'From', fa: 'از' },
  to: { en: 'To', fa: 'به' },
  customer_notes: { en: 'Customer Notes', fa: 'توضیحات مشتری' },
  customer_contact_phone: { en: 'Customer Phone', fa: 'تلفن مشتری' },


  // Chatbot
  chatbot: { en: 'AI Assistant', fa: 'دستیار هوش مصنوعی' },
  type_message: { en: 'Type your message...', fa: 'پیام خود را بنویسید...' },
  send: { en: 'Send', fa: 'ارسال' },
  error_ai_response: { en: 'Could not get response from AI. Please try again.', fa: 'خطا در دریافت پاسخ از هوش مصنوعی. لطفا دوباره تلاش کنید.' },
  waiting_for_response: { en: 'AI is typing...', fa: 'هوش مصنوعی در حال پاسخگویی است...' },
  close: { en: 'Close', fa: 'بستن' },

  // Referral
  referral_code: { en: 'Referral Code (Optional)', fa: 'کد معرف (اختیاری)' },
  your_referral_code: { en: 'Your Referral Code', fa: 'کد معرفی شما' },
  invite_friends: { en: 'Invite Friends', fa: 'دعوت از دوستان' },
  referral_bonus_desc: { en: 'Share your code to give your friends a free first order, and get one for yourself too!', fa: 'کد خود را به اشتراک بگذارید تا دوستانتان اولین سفارش خود را رایگان دریافت کنند، و شما هم یک سفارش رایگان بگیرید!' },
  copy: { en: 'Copy', fa: 'کپی' },
  no_referral_code_yet: { en: 'No referral code assigned yet.', fa: 'هنوز کد معرف اختصاص داده نشده است.' },

  // Delivery Flow
  place_order: { en: 'Place Order', fa: 'ثبت سفارش' },
  searching_for_courier: { en: 'Searching for a SharifBar...', fa: 'در جستجوی شریف‌بر...' },
  cancel_order: { en: 'لغو سفارش', fa: 'لغو سفارش' },
  courier_found: { en: 'Courier Found!', fa: 'پیک پیدا شد!' },
  proceed_to_payment: { en: 'Proceed to Payment', fa: 'پرداخت' },
  your_courier: { en: 'Your Courier', fa: 'پیک شما' },
  delivery_timeline: { en: 'Delivery Timeline', fa: 'زمان‌بندی تحویل' },
  eta: { en: 'ETA', fa: 'زمان تخمینی تحویل' },
  order_placed: { en: 'Order Placed', fa: 'سفارش ثبت شد' },
  courier_assigned: { en: 'Courier Assigned', fa: 'پیک مشخص شد' },
  payment_confirmed: { en: 'Payment Confirmed', fa: 'پرداخت تایید شد' },
  picked_up: { en: 'Picked Up', fa: 'توسط پیک دریافت شد' },
  on_the_way: { en: 'On The Way', fa: 'در مسیر' },
  delivered: { en: 'تحویل داده شد', fa: 'تحویل داده شد' },
  no_couriers_available: { en: 'No couriers available right now.', fa: 'در حال حاضر پیکی در دسترس نیست.' },
  retry_search: { en: 'Retry Search', fa: 'تلاش مجدد' },
  order_cancelled: { en: 'Order Cancelled', fa: 'سفارش لغو شد' },
  
  // New keys for manual payment and two-way delivery confirm
  edit_profile: { en: 'Edit Profile', fa: 'ویرایش پروفایل' },
  bank_card_number: { en: 'Bank Card Number', fa: 'شماره کارت بانکی' },
  upload_profile_picture: { en: 'Upload Profile Picture', fa: 'بارگذاری عکس پروفایل' },
  save_changes: { en: 'ذخیره تغییرات', fa: 'ذخیره تغییرات' },
  copy_card_number: { en: 'Copy Card Number', fa: 'کپی شماره کارت' },
  i_have_paid: { en: 'I Have Paid', fa: 'پرداخت کردم' },
  confirm_payment_received: { en: 'Confirm Payment Received', fa: 'تایید دریافت وجه' },
  awaiting_customer_payment: { en: 'Awaiting Customer Payment', fa: 'در انتظار پرداخت مشتری' },
  confirm_delivery_received: { en: 'Confirm Delivery Received', fa: 'تایید دریافت سفارش' },
  awaiting_customer_confirmation: { en: 'در انتظار تایید مشتری', fa: 'در انتظار تایید مشتری' },
  view_active_order: {en: 'View Active Order', fa: 'مشاهده سفارش فعال'},

  // Delivery Locations
  energy_faculty: { en: 'Energy Engineering Faculty', fa: 'دانشکده مهندسی انرژی' },
  management_faculty: { en: 'Management & Economics Faculty', fa: 'دانشکده مدیریت و اقتصاد' },
  civil_faculty: { en: 'Civil Engineering Faculty', fa: 'دانشکده مهندسی عمران' },
  physics_faculty: { en: 'Physics Faculty', fa: 'دانشکده فیزیک' },
  math_faculty: { en: 'Mathematical Sciences Faculty', fa: 'دانشکده علوم ریاضی' },
  chemistry_faculty: { en: 'Chemistry Faculty', fa: 'دانشکده شیمی' },
  electrical_faculty: { en: 'Electrical Engineering Faculty', fa: 'دانشکده مهندسی برق' },
  industrial_faculty: { en: 'Industrial Engineering Faculty', fa: 'دانشکده مهندسی صنایع' },
  chem_pet_faculty: { en: 'Chemical & Petroleum Eng. Faculty', fa: 'دانشکده مهندسی شیمی و نفت' },
  materials_faculty: { en: 'Materials Science & Eng. Faculty', fa: 'دانشکده مهندسی و علم مواد' },
  mechanical_faculty: { en: 'Mechanical Engineering Faculty', fa: 'دانشکده مهندسی مکانیک' },
  computer_faculty: { en: 'Computer Engineering Faculty', fa: 'دانشکده مهندسی کامپیوتر' },
  aero_faculty: { en: 'Aerospace Engineering Faculty', fa: 'دانشکده مهندسی هوا فضا' },
  test_management: { en: 'Test Management Department', fa: 'مدیریت تست بدز' },
  physical_education_management: { en: 'Physical Education Management', fa: 'مدیریت تربیت بدنی' },
  linguistics_center: { en: 'Linguistics Center', fa: 'مرکز زبان شناسی' },
  philosophy_group: { en: 'Philosophy of Science Group', fa: 'گروه فلسفه علم' },
  maaref_center: { en: 'Maaref Center', fa: 'مرکز معارف' },
  engineering_skills_center: { en: 'Engineering Skills Training Center', fa: 'مرکز آموزش مهارت‌های مهندسی' },
  ahmadi_roshan_dorm: { en: 'Ahmadi Roshan Dormitory', fa: 'خوابگاه احمدی روشن' },
  tarasht2_dorm: { en: 'Tarasht 2 Dormitory', fa: 'خوابگاه طرشت 2' },
  tarasht3_dorm: { en: 'Tarasht 3 Dormitory', fa: 'خوابگاه طرشت 3' },
  ibn_sina_building: { en: 'Ibn Sina Building', fa: 'ساختمان ابن سینا' },
  halls: { en: 'Auditoriums', fa: 'تالارها' },
  science_tech_park: { en: 'Science & Technology Park', fa: 'پارک علم و فناوری' },
  mosque: { en: 'Mosque', fa: 'مسجد' },
  education_building: { en: 'Education Building', fa: 'ساختمان آموزش' },
  amphitheater: { en: 'Amphitheater', fa: 'آمفی تئاتر' },
};

export const useTranslation = () => {
  const context = useContext(AppContext);
  const language = context ? context.language : 'fa';
  
  const t = (key: keyof typeof translations) => {
    return translations[key]?.[language] || translations[key]?.['en'] || key;
  };

  return { t, language, setLanguage: context ? context.setLanguage : () => {}, direction: language === 'fa' ? 'rtl' : 'ltr' as 'rtl' | 'ltr' };
};