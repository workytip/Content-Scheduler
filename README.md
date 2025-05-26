# Content-Scheduler
A simplified content scheduling application that lets users create and schedule posts across multiple social platforms.

## Laravel-ReactJs Application

This is a Laravel-based web application with React for Frontend. Follow the steps below to set up the project on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- [PHP](https://www.php.net/) (version 8.1 or higher)
- [Composer](https://getcomposer.org/) (PHP dependency manager)
- [MySQL](https://www.mysql.com/) or another supported database system
- [Git](https://git-scm.com/) (for version control)
- [Nodejs]

## Installation

1. **Clone the repository**

```
git clone https://github.com/workytip/Content-Scheduler.git
```

2. **Install PHP dependencies**

Open a new terminal, navigate to the Larave-API folder, and install dependencies:

```
composer install
```

3. **Create the environment file**

Copy the .env.example file to .env and update the environment variables as needed.
```
cp .env.example .env
```
Open the .env file and configure your database connection:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password
```

Set Token Expiration Time in minutes
```
TOKEN_EXPIRATION_TIME=120
```
4. **Generate an application key**

Run the following command to generate a unique application key:
```
php artisan key:generate
```
5. **Run database migrations and seeder**
```
php artisan migrate --seed
```

```
6.**Start the development server**

```
php artisan serve
```

7. **Install React frontend dependencies**

Open a new terminal, navigate to the React-UI folder, and install dependencies:

```
cd React-UI
npm install
```

8. **Start the React development server**

```
npm run dev
```
