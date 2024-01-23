const knexConfig = require("../../knexfile");

const environment = process.env.NODE_ENV || "development"

const knex = require("knex")(knexConfig[environment])

exports.etpNotif = async () => {
    try {
        const getUsersForReminder = async () => {
            const twoMonthsAgo = new Date();
            twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
            console.log(twoMonthsAgo.getMonth())
            const users = await knex('employments')
                .distinct('users.email')
                .join('users', 'users.hospital_id', '=', 'employments.hospital_id')
                .where(function () {
                    this.where('users.role', 'ADMIN_HOSPITAL')
                        .orWhere('users.role', 'OPERATOR_GENERIC')
                        .orWhere('users.role', 'OPERATOR_EMPLOYMENT');
                })
                .andWhere(function () {
                    this.where('employments.year', '=', 2023)
                        .andWhere('employments.month', '=', "11")
                        .orWhere(function() { 
                            this.where('employments.year', '=', 2023)
                            .andWhere('employments.month', '=', "10")
                        })
                        .whereNull('employments.data_month');
                })

            return users;
        };
        const use = await getUsersForReminder();
        console.log(use)
    } catch (e) {
        console.error("Error Prisma Crons Pilo :", e)
    }
}
