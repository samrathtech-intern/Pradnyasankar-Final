SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS pradnyasanskar
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pradnyasanskar;

CREATE TABLE categories (
  id                CHAR(36)      NOT NULL DEFAULT (UUID()),
  name              VARCHAR(150)  NOT NULL,
  parent_category_id CHAR(36)     NULL,
  description       VARCHAR(1000) NULL,
  is_active         BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_categories_parent (parent_category_id),
  CONSTRAINT fk_categories_parent
    FOREIGN KEY (parent_category_id) REFERENCES categories(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE tax_classes (
  id     CHAR(36)      NOT NULL DEFAULT (UUID()),
  name   VARCHAR(100)  NOT NULL,
  rate   DECIMAL(5,2)  NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_tax_classes_name (name)
) ENGINE=InnoDB;

CREATE TABLE attributes (
  id    CHAR(36)     NOT NULL DEFAULT (UUID()),
  name  VARCHAR(100) NOT NULL,
  type  VARCHAR(50)  NOT NULL DEFAULT 'text',
  PRIMARY KEY (id),
  UNIQUE KEY uq_attributes_name (name)
) ENGINE=InnoDB;

CREATE TABLE attribute_values (
  id           CHAR(36)     NOT NULL DEFAULT (UUID()),
  attribute_id CHAR(36)     NOT NULL,
  value        VARCHAR(150) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_attribute_values_attribute (attribute_id),
  UNIQUE KEY uq_attribute_value (attribute_id, value),
  CONSTRAINT fk_attribute_values_attribute
    FOREIGN KEY (attribute_id) REFERENCES attributes(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE roles (
  id          CHAR(36)     NOT NULL DEFAULT (UUID()),
  name        VARCHAR(100) NOT NULL,
  description VARCHAR(500) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_roles_name (name)
) ENGINE=InnoDB;

CREATE TABLE permissions (
  id       CHAR(36)     NOT NULL DEFAULT (UUID()),
  name     VARCHAR(150) NOT NULL,
  resource VARCHAR(100) NOT NULL,
  action   VARCHAR(50)  NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_permission_resource_action (resource, action)
) ENGINE=InnoDB;

CREATE TABLE role_permissions (
  id            CHAR(36) NOT NULL DEFAULT (UUID()),
  role_id       CHAR(36) NOT NULL,
  permission_id CHAR(36) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_role_permission (role_id, permission_id),
  KEY idx_role_permissions_role (role_id),
  KEY idx_role_permissions_permission (permission_id),
  CONSTRAINT fk_role_permissions_role
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_role_permissions_permission
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE admin_users (
  id            CHAR(36)     NOT NULL DEFAULT (UUID()),
  role_id       CHAR(36)     NOT NULL,
  email         VARCHAR(255) NOT NULL,
  name          VARCHAR(150) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admin_users_email (email),
  KEY idx_admin_users_role (role_id),
  CONSTRAINT fk_admin_users_role
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE customers (
  id            CHAR(36)     NOT NULL DEFAULT (UUID()),
  email         VARCHAR(255) NULL,
  phone         VARCHAR(20)  NULL,
  name          VARCHAR(150) NULL,
  password_hash VARCHAR(255) NULL,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_customers_email (email),
  UNIQUE KEY uq_customers_phone (phone)
) ENGINE=InnoDB;

CREATE TABLE addresses (
  id             CHAR(36)     NOT NULL DEFAULT (UUID()),
  customer_id    CHAR(36)     NOT NULL,
  address_line1  VARCHAR(255) NOT NULL,
  address_line2  VARCHAR(255) NULL,
  city           VARCHAR(100) NOT NULL,
  state          VARCHAR(100) NOT NULL,
  postal_code    VARCHAR(15)  NOT NULL,
  country        VARCHAR(100) NOT NULL DEFAULT 'India',
  is_default     BOOLEAN      NOT NULL DEFAULT FALSE,
  PRIMARY KEY (id),
  KEY idx_addresses_customer (customer_id),
  CONSTRAINT fk_addresses_customer
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE consents (
  id            CHAR(36)    NOT NULL DEFAULT (UUID()),
  customer_id   CHAR(36)    NOT NULL,
  consent_type  VARCHAR(50) NOT NULL,
  granted_at    TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_consents_customer (customer_id),
  CONSTRAINT fk_consents_customer
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE products (
  id           CHAR(36)      NOT NULL DEFAULT (UUID()),
  category_id  CHAR(36)      NOT NULL,
  tax_class_id CHAR(36)      NOT NULL,
  name         VARCHAR(255)  NOT NULL,
  slug         VARCHAR(255)  NOT NULL,
  description  VARCHAR(2000) NULL,
  base_price   DECIMAL(10,2) NOT NULL,
  is_active    BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_products_slug (slug),
  KEY idx_products_category (category_id),
  KEY idx_products_tax_class (tax_class_id),
  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_products_tax_class
    FOREIGN KEY (tax_class_id) REFERENCES tax_classes(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE product_variants (
  id             CHAR(36)      NOT NULL DEFAULT (UUID()),
  product_id     CHAR(36)      NOT NULL,
  sku            VARCHAR(100)  NOT NULL,
  price          DECIMAL(10,2) NOT NULL,
  stock_quantity INT UNSIGNED  NOT NULL DEFAULT 0,
  attributes     JSON          NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_product_variants_sku (sku),
  KEY idx_product_variants_product (product_id),
  CONSTRAINT fk_product_variants_product
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE product_media (
  id         CHAR(36)     NOT NULL DEFAULT (UUID()),
  product_id CHAR(36)     NOT NULL,
  media_url  VARCHAR(500) NOT NULL,
  media_type VARCHAR(20)  NOT NULL DEFAULT 'image',
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_product_media_product (product_id),
  CONSTRAINT fk_product_media_product
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE product_attribute_values (
  id                 CHAR(36) NOT NULL DEFAULT (UUID()),
  product_id         CHAR(36) NOT NULL,
  attribute_value_id CHAR(36) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_product_attribute_value (product_id, attribute_value_id),
  KEY idx_pav_product (product_id),
  KEY idx_pav_attribute_value (attribute_value_id),
  CONSTRAINT fk_pav_product
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_pav_attribute_value
    FOREIGN KEY (attribute_value_id) REFERENCES attribute_values(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE stock_ledger (
  id              CHAR(36)  NOT NULL DEFAULT (UUID()),
  product_id      CHAR(36)  NOT NULL,
  variant_id      CHAR(36)  NULL,
  quantity_change INT       NOT NULL,
  reason          VARCHAR(50) NOT NULL,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_stock_ledger_product (product_id),
  KEY idx_stock_ledger_variant (variant_id),
  CONSTRAINT fk_stock_ledger_product
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_stock_ledger_variant
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE media (
  id          CHAR(36)     NOT NULL DEFAULT (UUID()),
  filename    VARCHAR(255) NOT NULL,
  url         VARCHAR(500) NOT NULL,
  mime_type   VARCHAR(100) NOT NULL,
  uploaded_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE banners (
  id        CHAR(36)     NOT NULL DEFAULT (UUID()),
  media_id  CHAR(36)     NOT NULL,
  title     VARCHAR(200) NOT NULL,
  link_url  VARCHAR(500) NULL,
  position  VARCHAR(50)  NOT NULL DEFAULT 'homepage',
  is_active BOOLEAN      NOT NULL DEFAULT TRUE,
  PRIMARY KEY (id),
  KEY idx_banners_media (media_id),
  CONSTRAINT fk_banners_media
    FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE content_pages (
  id           CHAR(36)     NOT NULL DEFAULT (UUID()),
  slug         VARCHAR(255) NOT NULL,
  title        VARCHAR(255) NOT NULL,
  content      TEXT         NULL,
  is_published BOOLEAN      NOT NULL DEFAULT FALSE,
  PRIMARY KEY (id),
  UNIQUE KEY uq_content_pages_slug (slug)
) ENGINE=InnoDB;

CREATE TABLE faqs (
  id        CHAR(36)     NOT NULL DEFAULT (UUID()),
  question  VARCHAR(500) NOT NULL,
  answer    TEXT         NOT NULL,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE articles (
  id           CHAR(36)     NOT NULL DEFAULT (UUID()),
  title        VARCHAR(255) NOT NULL,
  slug         VARCHAR(255) NOT NULL,
  content      TEXT         NULL,
  published_at TIMESTAMP    NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_articles_slug (slug)
) ENGINE=InnoDB;

CREATE TABLE article_products (
  id         CHAR(36) NOT NULL DEFAULT (UUID()),
  article_id CHAR(36) NOT NULL,
  product_id CHAR(36) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_article_product (article_id, product_id),
  KEY idx_article_products_article (article_id),
  KEY idx_article_products_product (product_id),
  CONSTRAINT fk_article_products_article
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_article_products_product
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE b2b_enquiries (
  id           CHAR(36)     NOT NULL DEFAULT (UUID()),
  company_name VARCHAR(255) NULL,
  contact_name VARCHAR(150) NOT NULL,
  email        VARCHAR(255) NOT NULL,
  phone        VARCHAR(20)  NULL,
  message      TEXT         NULL,
  status       VARCHAR(30)  NOT NULL DEFAULT 'new',
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_b2b_enquiries_status (status)
) ENGINE=InnoDB;

CREATE TABLE enquiry_attachments (
  id          CHAR(36)     NOT NULL DEFAULT (UUID()),
  enquiry_id  CHAR(36)     NOT NULL,
  file_url    VARCHAR(500) NOT NULL,
  filename    VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_enquiry_attachments_enquiry (enquiry_id),
  CONSTRAINT fk_enquiry_attachments_enquiry
    FOREIGN KEY (enquiry_id) REFERENCES b2b_enquiries(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE shipping_zones (
  id        CHAR(36)     NOT NULL DEFAULT (UUID()),
  name      VARCHAR(150) NOT NULL,
  countries JSON         NULL,
  states    JSON         NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE shipping_rates (
  id               CHAR(36)      NOT NULL DEFAULT (UUID()),
  shipping_zone_id CHAR(36)      NOT NULL,
  name             VARCHAR(150)  NOT NULL,
  min_weight       DECIMAL(8,3)  NOT NULL,
  max_weight       DECIMAL(8,3)  NOT NULL,
  rate             DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_shipping_rates_zone (shipping_zone_id),
  CONSTRAINT fk_shipping_rates_zone
    FOREIGN KEY (shipping_zone_id) REFERENCES shipping_zones(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT chk_shipping_rates_weight CHECK (max_weight >= min_weight)
) ENGINE=InnoDB;

CREATE TABLE coupons (
  id               CHAR(36)      NOT NULL DEFAULT (UUID()),
  code             VARCHAR(50)   NOT NULL,
  discount_type    ENUM('flat','percent') NOT NULL,
  discount_value   DECIMAL(10,2) NOT NULL,
  min_order_value  DECIMAL(10,2) NOT NULL DEFAULT 0,
  max_uses         INT UNSIGNED  NULL,
  valid_from       TIMESTAMP     NOT NULL,
  valid_until      TIMESTAMP     NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_coupons_code (code),
  CONSTRAINT chk_coupons_validity CHECK (valid_until >= valid_from)
) ENGINE=InnoDB;

CREATE TABLE coupon_scopes (
  id         CHAR(36)    NOT NULL DEFAULT (UUID()),
  coupon_id  CHAR(36)    NOT NULL,
  scope_type VARCHAR(20) NOT NULL,
  scope_id   CHAR(36)    NULL,
  PRIMARY KEY (id),
  KEY idx_coupon_scopes_coupon (coupon_id),
  CONSTRAINT fk_coupon_scopes_coupon
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE carts (
  id          CHAR(36)  NOT NULL DEFAULT (UUID()),
  customer_id CHAR(36)  NULL,
  is_active   BOOLEAN   NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_carts_customer (customer_id),
  CONSTRAINT fk_carts_customer
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE cart_items (
  id         CHAR(36)     NOT NULL DEFAULT (UUID()),
  cart_id    CHAR(36)     NOT NULL,
  product_id CHAR(36)     NOT NULL,
  variant_id CHAR(36)     NULL,
  quantity   INT UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  KEY idx_cart_items_cart (cart_id),
  KEY idx_cart_items_product (product_id),
  KEY idx_cart_items_variant (variant_id),
  CONSTRAINT fk_cart_items_cart
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_cart_items_product
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_cart_items_variant
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT chk_cart_items_qty CHECK (quantity > 0)
) ENGINE=InnoDB;

CREATE TABLE wishlists (
  id          CHAR(36)  NOT NULL DEFAULT (UUID()),
  customer_id CHAR(36)  NOT NULL,
  product_id  CHAR(36)  NOT NULL,
  added_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_wishlist_customer_product (customer_id, product_id),
  KEY idx_wishlists_product (product_id),
  CONSTRAINT fk_wishlists_customer
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_wishlists_product
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE reviews (
  id          CHAR(36)     NOT NULL DEFAULT (UUID()),
  product_id  CHAR(36)     NOT NULL,
  customer_id CHAR(36)     NOT NULL,
  rating      TINYINT      NOT NULL,
  title       VARCHAR(200) NULL,
  content     TEXT         NULL,
  is_approved BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_reviews_product (product_id),
  KEY idx_reviews_customer (customer_id),
  CONSTRAINT fk_reviews_product
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_reviews_customer
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB;

CREATE TABLE orders (
  id                  CHAR(36)      NOT NULL DEFAULT (UUID()),
  customer_id         CHAR(36)      NULL,
  shipping_address_id CHAR(36)      NULL,
  billing_address_id  CHAR(36)      NULL,
  status              ENUM('draft','awaiting_payment','payment_failed','paid',
                           'processing','shipped','delivered','cancelled','refunded')
                      NOT NULL DEFAULT 'draft',
  subtotal            DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_amount          DECIMAL(10,2) NOT NULL DEFAULT 0,
  shipping_amount     DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount_amount     DECIMAL(10,2) NOT NULL DEFAULT 0,
  total               DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_orders_customer (customer_id),
  KEY idx_orders_status (status),
  KEY idx_orders_shipping_address (shipping_address_id),
  KEY idx_orders_billing_address (billing_address_id),
  CONSTRAINT fk_orders_customer
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_orders_shipping_address
    FOREIGN KEY (shipping_address_id) REFERENCES addresses(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_orders_billing_address
    FOREIGN KEY (billing_address_id) REFERENCES addresses(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT chk_orders_total CHECK (total = subtotal + tax_amount + shipping_amount - discount_amount)
) ENGINE=InnoDB;

CREATE TABLE order_items (
  id           CHAR(36)      NOT NULL DEFAULT (UUID()),
  order_id     CHAR(36)      NOT NULL,
  product_id   CHAR(36)      NULL,
  variant_id   CHAR(36)      NULL,
  product_name VARCHAR(255)  NOT NULL,
  sku          VARCHAR(100)  NOT NULL,
  unit_price   DECIMAL(10,2) NOT NULL,
  quantity     INT UNSIGNED  NOT NULL,
  total_price  DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_order_items_order (order_id),
  KEY idx_order_items_product (product_id),
  CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_order_items_product
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_order_items_variant
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT chk_order_items_qty CHECK (quantity > 0)
) ENGINE=InnoDB;

CREATE TABLE order_status_history (
  id         CHAR(36)     NOT NULL DEFAULT (UUID()),
  order_id   CHAR(36)     NOT NULL,
  status     VARCHAR(50)  NOT NULL,
  notes      VARCHAR(500) NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_order_status_history_order (order_id),
  CONSTRAINT fk_order_status_history_order
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE coupon_redemptions (
  id           CHAR(36)  NOT NULL DEFAULT (UUID()),
  coupon_id    CHAR(36)  NOT NULL,
  customer_id  CHAR(36)  NULL,
  order_id     CHAR(36)  NOT NULL,
  redeemed_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_coupon_redemption_order (coupon_id, order_id),
  KEY idx_coupon_redemptions_coupon (coupon_id),
  KEY idx_coupon_redemptions_customer (customer_id),
  CONSTRAINT fk_coupon_redemptions_coupon
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_coupon_redemptions_customer
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_coupon_redemptions_order
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE razorpay_orders (
  id                CHAR(36)      NOT NULL DEFAULT (UUID()),
  order_id          CHAR(36)      NOT NULL,
  razorpay_order_id VARCHAR(100)  NOT NULL,
  amount            DECIMAL(10,2) NOT NULL,
  currency          VARCHAR(10)   NOT NULL DEFAULT 'INR',
  status            VARCHAR(30)   NOT NULL DEFAULT 'created',
  created_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_razorpay_orders_rzp_id (razorpay_order_id),
  KEY idx_razorpay_orders_order (order_id),
  CONSTRAINT fk_razorpay_orders_order
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE payments (
  id                  CHAR(36)      NOT NULL DEFAULT (UUID()),
  order_id            CHAR(36)      NOT NULL,
  razorpay_payment_id VARCHAR(100)  NULL,
  amount              DECIMAL(10,2) NOT NULL,
  status              ENUM('created','authorized','captured','failed') NOT NULL DEFAULT 'created',
  method              VARCHAR(30)   NULL,
  created_at          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_payments_rzp_payment_id (razorpay_payment_id),
  KEY idx_payments_order (order_id),
  KEY idx_payments_status (status),
  CONSTRAINT fk_payments_order
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE refunds (
  id                 CHAR(36)      NOT NULL DEFAULT (UUID()),
  payment_id         CHAR(36)      NOT NULL,
  razorpay_refund_id VARCHAR(100)  NULL,
  amount             DECIMAL(10,2) NOT NULL,
  reason             VARCHAR(255)  NULL,
  status             ENUM('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
  created_at         TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_refunds_rzp_refund_id (razorpay_refund_id),
  KEY idx_refunds_payment (payment_id),
  CONSTRAINT fk_refunds_payment
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE webhook_events (
  id                CHAR(36)     NOT NULL DEFAULT (UUID()),
  order_id          CHAR(36)     NULL,
  razorpay_event_id VARCHAR(150) NOT NULL,
  event_type        VARCHAR(100) NOT NULL,
  payload           JSON         NULL,
  processed_at      TIMESTAMP    NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_webhook_events_rzp_event_id (razorpay_event_id),
  KEY idx_webhook_events_order (order_id),
  CONSTRAINT fk_webhook_events_order
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE invoices (
  id             CHAR(36)      NOT NULL DEFAULT (UUID()),
  order_id       CHAR(36)      NOT NULL,
  invoice_number VARCHAR(50)   NOT NULL,
  issued_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  total          DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_invoices_number (invoice_number),
  UNIQUE KEY uq_invoices_order (order_id),
  CONSTRAINT fk_invoices_order
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE credit_notes (
  id                CHAR(36)      NOT NULL DEFAULT (UUID()),
  invoice_id        CHAR(36)      NOT NULL,
  credit_note_number VARCHAR(50)  NOT NULL,
  amount            DECIMAL(10,2) NOT NULL,
  reason            VARCHAR(255)  NULL,
  issued_at         TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_credit_notes_number (credit_note_number),
  KEY idx_credit_notes_invoice (invoice_id),
  CONSTRAINT fk_credit_notes_invoice
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE shipments (
  id              CHAR(36)     NOT NULL DEFAULT (UUID()),
  order_id        CHAR(36)     NOT NULL,
  carrier         VARCHAR(100) NULL,
  tracking_number VARCHAR(100) NULL,
  status          ENUM('pending','dispatched','in_transit','out_for_delivery',
                       'delivered','delivery_exception','returned_to_origin')
                  NOT NULL DEFAULT 'pending',
  shipped_at      TIMESTAMP    NULL,
  delivered_at    TIMESTAMP    NULL,
  PRIMARY KEY (id),
  KEY idx_shipments_order (order_id),
  CONSTRAINT fk_shipments_order
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE shipment_tracking_events (
  id           CHAR(36)     NOT NULL DEFAULT (UUID()),
  shipment_id  CHAR(36)     NOT NULL,
  status       VARCHAR(50)  NOT NULL,
  location     VARCHAR(150) NULL,
  event_time   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_shipment_tracking_events_shipment (shipment_id),
  CONSTRAINT fk_shipment_tracking_events_shipment
    FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE cancellations (
  id           CHAR(36)     NOT NULL DEFAULT (UUID()),
  order_id     CHAR(36)     NOT NULL,
  reason       VARCHAR(255) NULL,
  cancelled_by VARCHAR(150) NULL,
  cancelled_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_cancellations_order (order_id),
  CONSTRAINT fk_cancellations_order
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE return_requests (
  id         CHAR(36)    NOT NULL DEFAULT (UUID()),
  order_id   CHAR(36)    NOT NULL,
  reason     VARCHAR(255) NULL,
  status     ENUM('requested','approved','rejected','pickup_scheduled',
                  'received','inspected','completed')
             NOT NULL DEFAULT 'requested',
  created_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_return_requests_order (order_id),
  CONSTRAINT fk_return_requests_order
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE return_items (
  id               CHAR(36)     NOT NULL DEFAULT (UUID()),
  return_request_id CHAR(36)    NOT NULL,
  order_item_id    CHAR(36)     NOT NULL,
  quantity         INT UNSIGNED NOT NULL,
  `condition`      VARCHAR(100) NULL,
  PRIMARY KEY (id),
  KEY idx_return_items_return_request (return_request_id),
  KEY idx_return_items_order_item (order_item_id),
  CONSTRAINT fk_return_items_return_request
    FOREIGN KEY (return_request_id) REFERENCES return_requests(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_return_items_order_item
    FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT chk_return_items_qty CHECK (quantity > 0)
) ENGINE=InnoDB;

CREATE TABLE audit_logs (
  id            CHAR(36)     NOT NULL DEFAULT (UUID()),
  admin_user_id CHAR(36)     NULL,
  action        VARCHAR(100) NOT NULL,
  entity_type   VARCHAR(100) NOT NULL,
  entity_id     CHAR(36)     NOT NULL,
  changes       JSON         NULL,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_audit_logs_admin_user (admin_user_id),
  KEY idx_audit_logs_entity (entity_type, entity_id),
  CONSTRAINT fk_audit_logs_admin_user
    FOREIGN KEY (admin_user_id) REFERENCES admin_users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;