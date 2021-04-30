import Layout from "../components/layout";
import dbConnect from "../utils/dbConnect";
import Post from "../models/Post";
import moment from "moment";
import { useEffect, useState, useCallback } from "react";
import cities from "../data/cities.json";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/client";
import toast from "../components/toast";
import { headerCase } from "change-case";
import {
  List,
  Button,
  Label,
  Segment,
  Form,
  Table,
  Pagination,
  Icon,
  Modal,
  Header,
  Card,
  Comment,
  Grid,
} from "semantic-ui-react";
const itemColor = {
  beds: "olive",
  icu: "teal",
  oxygen: "brown",
  ventilator: "black",
  tests: "yellow",
  fabiflu: "grey",
  remdesivir: "violet",
  favipiravir: "orange",
  tocilizumab: "blue",
  plasma: "pink",
  food: "olive",
};
const Index = ({ posts }) => {
  const [session, loading] = useSession();
  const [form, setForm] = useState({
    for: [],
    purpose: [],
    city: [],
    page: 1,
    other: "",
  });
  const [open, setOpen] = useState(false);
  const [detailPost, setDetailPost] = useState({});
  const router = useRouter();
  const notify = useCallback((type, message) => {
    toast({ type, message });
  }, []);
  useEffect(() => {
    if (router.query && router.query.query) {
      setForm(JSON.parse(decodeURIComponent(router.query.query)));
    }
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    let query = encodeURIComponent(JSON.stringify(form));
    window.location.href = `${window.location.origin}?query=` + query;
  };
  const handleClear = (e) => {
    e.preventDefault();
    window.location.href = window.location.origin;
  };
  const handlevote = async (postId, type) => {
    if (!session) {
      notify("info", "Please sign in to vote!");
      return;
    }
    try {
      const res = await fetch(`/api/votes/${postId}?type=${type}`, {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error(res.status);
      }

      posts.map((post) => {
        if (post._id == postId) {
          if (type == "upvote") {
            post.hasUpVoted = true;
          } else if (type == "downvote") {
            post.hasDownVoted = true;
          }
        }
      });

      notify("info", "Your vote has been saved!");
    } catch (error) {
      notify("error", "Your vote could not be saved!");
    }
  };
  const handleChange = (e, data) => {
    let value = data.value;
    let name = data.name;
    if (name == "for" || name == "purpose") {
      if (data.checked == true) {
        value = [...form[name], data.value];
      } else if (data.checked == false) {
        form[name].splice(form[name].indexOf(data.value), 1);
        value = [...form[name]];
      }
    }
    // if (name == "city") {
    //   value = data.value.split(",");
    // }
    setForm({
      ...form,
      [name]: value,
    });
  };
  // useEffect(() => {
  //   // let query = encodeURIComponent(JSON.stringify(form));
  //   // window.location.href = "window.location.origin/?query=" + query;
  // }, [form.page]);
  const handlePageChange = (e, d) => {
    e.preventDefault();
    setForm({ ...form, page: d.activePage });
  };

  const handleMoreDetails = (post) => {
    setDetailPost(post);
    setOpen(true);
  };
  return (
    <Layout>
      <Header>
        Search Posts
        <Button as="a" href="/post" floated="right" primary>
          New Post
        </Button>
      </Header>
      <br></br>
      <Segment>
        <Form onSubmit={handleSubmit}>
          <Form.Group inline>
            <label>Search for </label>
            <Form.Checkbox
              label="Available"
              value="available"
              name="purpose"
              onChange={handleChange}
              checked={form.purpose.indexOf("available") >= 0}
            />
            <Form.Checkbox
              label="Needed"
              value="request"
              name="purpose"
              onChange={handleChange}
              checked={form.purpose.indexOf("request") >= 0}
            />
          </Form.Group>
          <Form.Group inline>
            <label>Items</label>
            <Form.Checkbox
              onChange={handleChange}
              name="for"
              value="beds"
              label="Beds"
              checked={form.for.indexOf("beds") >= 0}
            />
            <Form.Checkbox
              onChange={handleChange}
              name="for"
              value="icu"
              label="ICU"
              checked={form.for.indexOf("icu") >= 0}
            />
            <Form.Checkbox
              onChange={handleChange}
              name="for"
              value="oxygen"
              label="Oxygen"
              checked={form.for.indexOf("oxygen") >= 0}
            />
            <Form.Checkbox
              onChange={handleChange}
              name="for"
              value="ventilator"
              label="Ventilator"
              checked={form.for.indexOf("ventilator") >= 0}
            />
            <Form.Checkbox
              onChange={handleChange}
              name="for"
              value="tests"
              label="Tests"
              checked={form.for.indexOf("tests") >= 0}
            />
            <Form.Checkbox
              name="for"
              onChange={handleChange}
              value="fabiflu"
              label="Fabiflu"
              checked={form.for.indexOf("fabiflu") >= 0}
            />
            <Form.Checkbox
              name="for"
              onChange={handleChange}
              value="remdesivir"
              label="Remdesivir"
              checked={form.for.indexOf("remdesivir") >= 0}
            />
            <Form.Checkbox
              name="for"
              onChange={handleChange}
              value="favipiravir"
              id="Favipiravir"
              label="Favipiravir"
              checked={form.for.indexOf("favipiravir") >= 0}
            />
            <Form.Checkbox
              name="for"
              onChange={handleChange}
              value="tocilizumab"
              label="Tocilizumab"
              checked={form.for.indexOf("tocilizumab") >= 0}
            />
            <Form.Checkbox
              name="for"
              onChange={handleChange}
              value="plasma"
              label="Plasma"
              checked={form.for.indexOf("plasma") >= 0}
            />
            <Form.Checkbox
              name="for"
              onChange={handleChange}
              value="food"
              label="Food"
              checked={form.for.indexOf("food") >= 0}
            />
          </Form.Group>
          <Form.Select
            search
            multiple
            label="In and around"
            placeholder="Select your city"
            options={cities.map((city) => {
              return {
                key: city,
                value: city,
                text: city,
              };
            })}
            name="city"
            value={form.city}
            onChange={handleChange}
          />
          <Form.Input
            label="Text Search"
            placeholder="Text Search..."
            name="others"
            value={form.others}
            onChange={handleChange}
          />
          <Button type="submit">Submit</Button>
          <Button onClick={handleClear}>Clear</Button>
        </Form>
      </Segment>
      <Card.Group stackable>
        {posts.map((post) => {
          {
            return (
              <Card fluid color={post.purpose == "request" ? "green" : "blue"}>
                <Card.Content key={post._id}>
                  <Label
                    as="a"
                    color={post.purpose == "request" ? "green" : "blue"}
                    ribbon="right"
                  >
                    {post.purpose == "request" ? "Needed" : "Available"}
                  </Label>
                  {/* <Table.Cell> */}
                  <Card.Header>
                    {post.contactName} - {post.city}
                  </Card.Header>
                  <Card.Description>
                    <List bulleted horizontal>
                      <List.Item as="a" href={`tel:${post.contactNumber}`}>
                        {post.contactNumber}
                      </List.Item>
                      {post.secondaryContactNumber && (
                        <List.Item
                          as="a"
                          href={`tel:${post.secondaryContactNumber}`}
                        >
                          {post.secondaryContactNumber}
                        </List.Item>
                      )}
                      <List.Item
                        as="a"
                        onClick={() => {
                          handleMoreDetails(post);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        More Details
                      </List.Item>
                    </List>
                    <Grid>
                      <Grid.Row columns="2">
                        <Grid.Column>
                          <Label.Group size="medium">
                            {post.for.sort().map((item) => {
                              return (
                                <Label color={itemColor[item]} key={item}>
                                  {headerCase(item)}
                                </Label>
                              );
                            })}
                          </Label.Group>
                        </Grid.Column>
                        <Grid.Column floated="right" textAlign="right">
                          <Button
                            basic
                            positive
                            icon
                            onClick={(e) => {
                              if (post.hasDownVoted || post.hasUpVoted) {
                                notify("info", "You have already voted!");
                              } else {
                                handlevote(post._id, "upvote");
                              }
                            }}
                          >
                            &nbsp;&nbsp;Upvote ({post.upVoteCount})
                          </Button>
                          <Button
                            basic
                            negative
                            icon
                            onClick={(e) => {
                              if (post.hasDownVoted || post.hasUpVoted) {
                                notify("info", "You have already voted!");
                              } else {
                                handlevote(post._id, "downvote");
                              }
                            }}
                          >
                            Downvote ({post.downVoteCount})
                          </Button>
                          <br></br>
                          <i>
                            {post.hasUpVoted == true ? "You upvoted this" : ""}
                            {post.hasDownVoted == true
                              ? "You downvoted this"
                              : ""}
                            {post.hasUpVoted == false &&
                            post.hasDownVoted == false
                              ? "Please rate this to help others"
                              : ""}
                          </i>
                          {/* <Button size="tiny" as="div" labelPosition="left">
                            <Label as="a" basic pointing="right">
                              {post.upVoteCount}
                            </Label>
                            <Button negative icon>
                              <Icon name="thumbs down" />
                              Down vote
                            </Button>
                          </Button> */}
                          {/* <Button basic color="green">
                            Upvote ({post.upVoteCount})
                          </Button>
                          <Button basic color="red">
                            Downvote ({post.downVoteCount})
                          </Button> */}
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>

                    {post.purpose == "request" && (
                      <List bulleted horizontal>
                        <List.Item>Patient </List.Item>
                        <List.Item>{post.patientName}</List.Item>
                        <List.Item>{post.patientAge}</List.Item>
                        <List.Item>{post.patientGender}</List.Item>
                        {/* {post.otherDetails && (
                          <List.Item
                            as="a"
                            onClick={() => {
                              handleMoreDetails(post);
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            <small>View More</small>
                          </List.Item>
                        )} */}
                      </List>
                    )}
                    {post.isVerified && (
                      <div>
                        <List bulleted horizontal>
                          <List.Item>
                            Verified Personally{" "}
                            <Icon fitted color="green" name="check square" />
                          </List.Item>
                        </List>
                        <br></br>
                      </div>
                    )}
                  </Card.Description>
                  {/* <Card.Content extra>
                    <div className="ui two buttons">
                      <Button basic color="green">
                        Upvote ({post.upVoteCount})
                      </Button>
                      <Button basic color="red">
                        Downvote ({post.downVoteCount})
                      </Button>
                    </div>
                    <i>
                      <small>
                        {post.hasUpVoted == true ? "You upvoted this" : ""}
                        {post.hasDownVoted == true ? "You downvoted this" : ""}
                        {post.hasUpVoted == false && post.hasDownVoted == false
                          ? "Please rate this to help others"
                          : ""}
                      </small>
                    </i>
                  </Card.Content> */}

                  {/* </Table.Cell> */}
                  {/* <Table.Cell>{post.city}</Table.Cell>
                  <Table.Cell>
                    {post.contactName}
                    <br></br>
                  </Table.Cell>
                  <Table.Cell>{moment(post.createdAt).fromNow()}</Table.Cell>
                  <Table.Cell>
                    <Button
                      content="Upvote"
                      icon="thumbs up"
                      label={{
                        as: "a",
                        basic: true,
                        content: post.upVoteCount,
                      }}
                      labelPosition="right"
                      size="small"
                      positive
                      onClick={(e) => {
                        if (post.hasDownVoted || post.hasUpVoted) {
                          notify("info", "You have already voted!");
                        } else {
                          handlevote(post._id, "upvote");
                        }
                      }}
                    />
                    <Button
                      content="Downvote"
                      icon="thumbs down"
                      label={{
                        as: "a",
                        basic: true,
                        pointing: "right",
                        content: post.downVoteCount,
                      }}
                      labelPosition="left"
                      size="small"
                      negative
                      onClick={(e) => {
                        e.preventDefault();
                        if (post.hasDownVoted || post.hasUpVoted) {
                          notify("info", "You have already voted!");
                        } else {
                          handlevote(post._id, "downvote");
                        }
                      }}
                    />
                    <br></br>
                    <p>
                      {post.hasUpVoted == true ? "You upvoted" : ""}
                      {post.hasDownVoted == true ? "You downvoted" : ""}
                    </p> */}
                  {/* </Table.Cell> */}
                </Card.Content>
              </Card>
            );
          }
        })}
      </Card.Group>
      {/* <Pagination
        activePage={form.page}
        totalPages={10}
        onPageChange={handlePageChange}
      /> */}
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
      >
        <Modal.Header>Details</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>{detailPost.otherDetails}</p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color="black" onClick={() => setOpen(false)}>
            Close
          </Button>
        </Modal.Actions>
      </Modal>
    </Layout>
  );
};

export const getServerSideProps = async function (context) {
  const req = context.req;
  const res = context.res;
  let query = context.query;
  const session = await getSession({ req });
  await dbConnect();
  if (query) {
    try {
      query = JSON.parse(query.query);
    } catch (error) {
      queru = {};
    }
  }
  /* find all the data in our database */
  let mongoQuery = {};
  if (query.purpose && query.purpose.length > 0) {
    mongoQuery.purpose = {
      $in: query.purpose,
    };
  }
  if (query.city && query.city.length > 0) {
    mongoQuery.city = {
      $in: query.city,
    };
  }
  if (query.for && query.for.length > 0) {
    mongoQuery.for = {
      $in: query.for,
    };
  }
  if (query.others && query.others.length > 0) {
    mongoQuery["$text"] = {
      $search: searchString,
    };
  }
  const result = await Post.find(mongoQuery).sort({ _id: -1 });
  const posts = result.map((doc) => {
    const post = doc.toObject();
    post._id = post._id.toString();
    post.upVoteCount = post.upVotes.length;
    post.downVoteCount = post.downVotes.length;
    if (session && session.user && session.user.email) {
      post.hasUpVoted = post.upVotes.indexOf(session.user.email) >= 0;
      post.hasDownVoted = post.downVotes.indexOf(session.user.email) >= 0;
    }
    post.createdAt = post.createdAt.toString();
    post.updatedAt = post.updatedAt.toString();
    return post;
  });

  return { props: { posts: posts } };
};

export default Index;
