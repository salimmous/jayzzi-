-- Create tables
CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(36) PRIMARY KEY,
  `email` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `name` varchar(255),
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `articles` (
  `id` varchar(36) PRIMARY KEY,
  `title` text NOT NULL,
  `sections` json NOT NULL,
  `options` json NOT NULL,
  `images` json DEFAULT NULL,
  `status` enum('draft', 'processing', 'completed', 'rejected') DEFAULT 'draft',
  `wordpress_draft` boolean DEFAULT false,
  `user_id` varchar(36),
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `images` (
  `id` varchar(36) PRIMARY KEY,
  `article_id` varchar(36),
  `url` text NOT NULL,
  `folder` varchar(255) DEFAULT 'article_images',
  `user_id` varchar(36),
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `pins` (
  `id` varchar(36) PRIMARY KEY,
  `article_id` varchar(36),
  `title` text NOT NULL,
  `description` text,
  `image` text NOT NULL,
  `interests` json DEFAULT NULL,
  `status` enum('pending', 'processing', 'completed', 'rejected') DEFAULT 'pending',
  `user_id` varchar(36),
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `keywords` (
  `id` varchar(36) PRIMARY KEY,
  `keyword` varchar(255) NOT NULL,
  `volume` int DEFAULT 0,
  `followers` int DEFAULT 0,
  `popularity` int DEFAULT 0,
  `position` int DEFAULT 0,
  `change` int DEFAULT 0,
  `user_id` varchar(36),
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `keyword_user` (`keyword`, `user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create default admin user
INSERT INTO `users` (`id`, `email`, `password`, `name`) VALUES
(UUID(), 'admin@jizzyai.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin');
