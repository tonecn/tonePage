import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function LayoutWithHeaderFooter({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            <main className="flex-1 flex flex-col bg-zinc-50">
                {children}
            </main>
            <Footer />
        </>
    )
}