import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req, { params }) {
    const { id } = params;
    const { name, email } = await req.json();
    const user = await prisma.user.update({
        where: { id: Number(id) },
        data: { name, email },
    });
    return Response.json(user);
}

export async function DELETE(req, { params }) {
    const { id } = params;
    await prisma.user.delete({ where: { id: Number(id) } });
    return new Response(null, { status: 204 });
}
