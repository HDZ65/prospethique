import { z } from "zod";
import { zfd } from "zod-form-data";

export const schemaCompany = zfd.formData({
    name: zfd.text(z.string().min(1, { message: "Le nom de l'entreprise est requis" })),
    members: zfd.text(z.array(z.string())),
    createdBy: zfd.text(z.string()),
    createdAt: zfd.text(z.string()),
    updatedBy: zfd.text(z.string()),
    updatedAt: zfd.text(z.string()),
});

export type Company = z.infer<typeof schemaCompany>;
