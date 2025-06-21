import cron from "node-cron";
import { Job } from "../models/jobSchema.js";
import { User } from "../models/userSchema.js";
import { sendEmail } from "../utils/sendEmail.js";
export const newsLetterCron = async () => {
    try {
        cron.schedule("*/1 * * * *", async () => {
            // console.log("running automation");
            const jobs = await Job.find({
                "newsLettersSent": false
            });
            for (const job of jobs) {
                const filteredUsers = await User.find({
                    $and: [
                        { role: "Job Seeker" },
                        {
                            $or: [
                                { "niches.firstNiche": job.jobNiche },
                                { "niches.secondNiche": job.jobNiche },
                                { "niches.thirdNiche": job.jobNiche },
                                { "niches.firstNiche": "all" },
                                { "niches.secondNiche": "all" },
                                { "niches.thirdNiche": "all" },
                            ],
                        },
                    ],
                });
                console.log("\n\n\n");
                console.log(filteredUsers.length);
                for (const user of filteredUsers) {
                    console.log(user.name);
                    const subject = `Hot Job Alert: ${job.title} in ${job.jobNiche} Available Now`;
                    const message = `Hi ${user.name},\n\nGreat news! A new job that fits your niche has just been posted. The position is for a ${job.title} with ${job.companyName}, and they are looking to hire immediately.\n\nJob Details:\n- **Position:** ${job.title}\n- **Company:** ${job.companyName}\n- **Location:** ${job.location}\n- **Salary:** ${job.salary}\n\nDon’t wait too long! Job openings like these are filled quickly. \n\nWe’re here to support you in your job search. Best of luck!\n\nBest Regards,\nNicheNest Team`;

                    sendEmail({ email: user.email, subject, message });
                }
                job.newsLettersSent = true;
                await job.save();
            }
        });
    } catch (error) {
        console.error("Error in newsLetterCron.js : ", error);
    }
}