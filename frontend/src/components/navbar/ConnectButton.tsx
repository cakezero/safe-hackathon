import { Mail } from "lucide-react";
import { useState } from "react";

interface ConnectButtonProps {
    // Add any props you need here
}

export default function ConnectButton({}: ConnectButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState("");

    const handleOpenModal = () => {
        setIsOpen(true);
    };

    const handleCloseModal = () => {
        setIsOpen(false);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Add your logic here to handle the form submission
        console.log("Email:", email);
    };

    return (
        <div>
            <button className="btn btn-primary" onClick={handleOpenModal}>
                <Mail className="w-6 h-6 mr-2" />
                Join with email
            </button>
            {isOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Join with email</h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="input input-primary w-full"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button type="submit" className="btn btn-primary mt-4">
                                Submit
                            </button>
                        </form>
                        <div className="modal-action">
                            <button className="btn" onClick={handleCloseModal}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}