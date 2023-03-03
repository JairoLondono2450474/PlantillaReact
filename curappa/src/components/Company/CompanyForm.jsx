import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import * as ComapanyServer from "./CompanyServer";

const ComapanyForm = () => {
    const navigate = useNavigate();
    const params = useParams();

    //console.log(params);

    const initialState = { id: 0, name: "", foundation: 1950, website: "" };

    const [company, setCompay] = useState(initialState);

    const handleInputChange = (e) => {
        //console.log(e.target.name);
        //console.log(e.target.value);
        setCompay({ ...company, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        //console.log(company);
        try {
            let res;
            if (!params.id) { //Modo de registro
                res = await ComapanyServer.registerCompany(company);
                const data = await res.json();
                //console.log(data);
                if (data.message === "Success") {
                    setCompay(initialState);
                }
            } else {
                await ComapanyServer.updateCompany(params.id, company);
            }
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    const getCompany = async (companyId) => {

        try {
            const res = await ComapanyServer.getCompany(companyId);
            const data = await res.json();
            //console.log(data);
            const { name, foundation, website } = data.company;
            setCompay({ name, foundation, website });
        } catch (error) {
            console.log(error);
        };
    };

    useEffect(() => {
        if (params.id) {
            getCompany(params.id);
        }
        // eslint-disable-next-line
    }, []);

    return (
        <div className="col-md-3 mx-auto">
            <h2 className="mb-3 text-center">Company</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" name="name" value={company.name} onChange={handleInputChange} className="form-control" minLength="2" maxLength="50" autoFocus required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Foundation</label>
                    <input type="number" name="foundation" value={company.foundation} onChange={handleInputChange} className="form-control" min="1900" max="2024" required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Website</label>
                    <input type="url" name="website" value={company.website} onChange={handleInputChange} className="form-control" maxLength="100" required />
                </div>
                <div className="d-grid gap-2">
                    {
                        params.id ? (
                            <button type="submit" className="btn btn-block btn-primary">
                                Update
                            </button>
                        ) : (
                            <button type="submit" className="btn btn-block btn-success">
                                Register
                            </button>
                        )}
                </div>
            </form>
        </div>
    )
};

export default ComapanyForm;